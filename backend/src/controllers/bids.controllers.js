import mongoose from "mongoose";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { Gig } from "../models/gig.models.js";
import { Bid } from "../models/bid.models.js";

const getAllBidsOnGig = asyncHandler(async (req, res) => {
  const { gigId } = req.params;

  // 1. Check if gig exists
  const gigExists = await Gig.findById(gigId).lean();
  if (!gigExists) {
    throw new ApiError(404, "Gig not found");
  }

  // 2. Fetch all bids for this gig
  const allBids = await Bid.find({ gigId })
    .populate("freelancerId", "avatar username fullname email")
    .lean();

  // 3. Send correct response
  const response = new ApiResponse(
    200,
    {
      gig: gigExists,
      bids: allBids,
      totalBids: allBids.length,
    },
    "All bids fetched successfully for this gig",
  );

  return res.status(200).json(response);
});

const postBid = asyncHandler(async (req, res) => {
  const { gigId, message } = req.body;

  // Extra validation When The Required Fields Are Missing....
  if (!gigId || !message) {
    throw new ApiError(400, "Gig ID and message are required", [
      {
        field: !gigId ? "gigId" : "message",
        message: "This field is required",
      },
    ]);
  }

  // req.user is Available Due To The VerifyJWT Middleware Used before this Controller...
  const userID = req.user._id;

  try {
    console.log("1");
    const checkGig = await Gig.findById(gigId);

    if (!checkGig) {
      throw new ApiError(404, "Gig Not Found");
    }

    if (checkGig.ownerId.toString() === userID) {
      throw new ApiError(400, "You cannot bid on your own gig");
    }

    // To Check Whether The User Has Already Placed A Bid On This Gig Or Not....
    const existingBid = await Bid.findOne({
      gigId: checkGig._id,
      freelancerId: userID,
    });

    if (existingBid) {
      throw new ApiError(409, "You have already placed a bid on this gig");
    }

    // To ensure it's a proper ObjectId type, not just a string.....
    // userid: new mongoose.Types.ObjectId(userID)
    const newBid = await Bid.create({
      gigId: checkGig._id,
      freelancerId: new mongoose.Types.ObjectId(userID),
      message,
    });

    console.log("2");

    // If The Creation Of The Project Fails....
    if (!newBid) {
      throw new ApiError(400, "Bid Creation Failed");
    }

    console.log("3");

    const currentBid = await Bid.findById(newBid._id)
      .populate("freelancerId", "avatar username fullname email")
      .populate("gigId", "title description budget")
      .lean();

    // Set cookies and redirect
    const response = new ApiResponse(
      200,
      currentBid,
      "New Bid Created successfully On GigFlow platform",
    );

    // Send All Projects To The Frontend....
    return res.status(response.statusCode).json(response);
  } catch (error) {
    // Handle any errors that occur during user creation
    throw new ApiError(500, "Internal server error", [
      {
        field: "server",
        message: "Internal server error In The createBid Controller",
      },
    ]);
  }
});

const registerBid = asyncHandler(async (req, res) => {
  const { bidId } = req.params;

  console.log("registerBid called with bidId:", bidId);
  console.log("request userId:", req.user?._id);

  try {
    // Fetch bid and related gig
    const bidExists = await Bid.findById(bidId).populate(
      "gigId",
      "_id ownerId status",
    );

    if (!bidExists || bidExists.gigId.status !== "open") {
      console.log("Bid not found:", bidId);
      throw new ApiError(404, "Bid Not Found");
    }

    console.log("Bid found:", bidExists._id);
    console.log("Gig ownerId:", bidExists.gigId.ownerId);

    // Authorization check
    if (bidExists.gigId.ownerId.toString() !== req.user._id.toString()) {
      console.log(
        "Unauthorized access. Gig owner:",
        bidExists.gigId.ownerId,
        "User:",
        req.user._id,
      );
      throw new ApiError(403, "You are not authorized to register this bid");
    }

    console.log("Current bid status:", bidExists.status);

    // Prevent re-processing
    if (bidExists.status === "hired" || bidExists.status === "rejected") {
      console.log("Bid already processed:", bidExists.status);
      throw new ApiError(400, "This bid has already been processed");
    }

    // Reject all bids for the gig
    console.log("Rejecting all bids for gigId:", bidExists.gigId._id);

    await findByIdAndUpdate(bidExists.gigId._id, { status: "assigned" });

    const rejectResult = await Bid.updateMany(
      { gigId: bidExists.gigId._id },
      { $set: { status: "rejected" } },
    );

    console.log("Rejected bids count:", rejectResult.modifiedCount);

    // Hire selected bid
    console.log("Hiring bid:", bidId);

    const hiredBid = await Bid.findByIdAndUpdate(
      bidId,
      { $set: { status: "hired" } },
      { new: true },
    );

    console.log("Bid hired successfully:", hiredBid?._id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          hiredBid,
          "Bid registered successfully. Other bids rejected.",
        ),
      );
  } catch (error) {
    console.error("Error in registerBid controller:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Internal server error", [
      {
        field: "server",
        message: "Internal server error in registerBid controller",
      },
    ]);
  }
});

export { getAllBidsOnGig, postBid, registerBid };
