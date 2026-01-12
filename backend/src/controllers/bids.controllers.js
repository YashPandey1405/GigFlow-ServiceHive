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

  // 1️⃣ Basic validation
  if (!gigId || !message) {
    throw new ApiError(400, "Gig ID and message are required", [
      {
        field: !gigId ? "gigId" : "message",
        message: "This field is required",
      },
    ]);
  }

  const userId = req.user._id;

  // 2️⃣ Check gig existence
  const gig = await Gig.findById(gigId);
  if (!gig) {
    throw new ApiError(404, "Gig not found");
  }

  // 3️⃣ Prevent owner from bidding
  if (gig.ownerId.toString() === userId.toString()) {
    throw new ApiError(400, "You cannot bid on your own gig");
  }

  // 4️⃣ Prevent duplicate bids
  const existingBid = await Bid.findOne({
    gigId,
    freelancerId: userId,
  });

  if (existingBid) {
    throw new ApiError(409, "You have already placed a bid on this gig");
  }

  // 5️⃣ Create bid
  const newBid = await Bid.create({
    gigId,
    freelancerId: userId, // mongoose casts automatically
    message,
    status: "pending",
  });

  if (!newBid) {
    throw new ApiError(400, "Bid creation failed");
  }

  // 6️⃣ Populate response
  const populatedBid = await Bid.findById(newBid._id)
    .populate("freelancerId", "avatar username fullname email")
    .populate("gigId", "title description budget")
    .lean();

  // 7️⃣ Send response
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        populatedBid,
        "New bid created successfully on GigFlow platform",
      ),
    );
});

const registerBid = asyncHandler(async (req, res) => {
  const { bidId } = req.params;
  const userId = req.user?._id;

  console.log("▶️ registerBid called", { bidId, userId });

  if (!bidId || !userId) {
    throw new ApiError(400, "Invalid request");
  }

  // 1️⃣ Fetch bid with gig
  const bid = await Bid.findById(bidId).populate("gigId", "_id ownerId status");

  if (!bid) {
    console.log("❌ Bid not found");
    throw new ApiError(404, "Bid not found");
  }

  if (!bid.gigId) {
    console.log("❌ Gig not linked with bid");
    throw new ApiError(500, "Gig not found for this bid");
  }

  // 2️⃣ Check gig status
  if (bid.gigId.status !== "open") {
    console.log("❌ Gig not open", bid.gigId.status);
    throw new ApiError(400, "Gig is not open for hiring");
  }

  // 3️⃣ Authorization check
  if (bid.gigId.ownerId.toString() !== userId.toString()) {
    console.log("🚫 Unauthorized access");
    throw new ApiError(403, "You are not authorized");
  }

  // 4️⃣ Prevent duplicate processing
  if (bid.status === "hired" || bid.status === "rejected") {
    console.log("⚠️ Bid already processed", bid.status);
    throw new ApiError(400, "Bid already processed");
  }

  // 5️⃣ Reject other bids
  console.log("🔁 Rejecting other bids");
  await Bid.updateMany(
    { gigId: bid.gigId._id, _id: { $ne: bidId } },
    { $set: { status: "rejected" } },
  );

  // 6️⃣ Hire selected bid
  console.log("✅ Hiring selected bid");
  const hiredBid = await Bid.findByIdAndUpdate(
    bidId,
    { $set: { status: "hired" } },
    { new: true },
  );

  // 7️⃣ Update gig status
  await Gig.findByIdAndUpdate(bid.gigId._id, {
    $set: { status: "assigned" },
  });

  console.log("🎉 Bid hired successfully", hiredBid._id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        hiredBid,
        "Bid hired successfully. Other bids rejected.",
      ),
    );
});

export { getAllBidsOnGig, postBid, registerBid };
