import mongoose from "mongoose";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { Gig } from "../models/gig.models.js";

const getGig = asyncHandler(async (req, res) => {
  try {
    const allGigs = await Gig.find({}).lean();

    // Set cookies and redirect
    const response = new ApiResponse(
      200,
      allGigs,
      "All Gigs Registered On GigFlow Platform",
    );

    // Send All Projects To The Frontend....
    return res.status(response.statusCode).json(response);
  } catch (error) {
    // Handle any errors that occur during user creation
    throw new ApiError(500, "Internal server error", [
      {
        field: "server",
        message: "Internal server error In The getGigs Controller",
      },
    ]);
  }
});

const postGig = asyncHandler(async (req, res) => {
  const { title, description, budget } = req.body;

  // Extra validation When The Required Fields Are Missing....
  if (!title || !description) {
    throw new ApiError(400, "Project title and description are required", [
      {
        field: !title ? "title" : "description",
        message: "This field is required",
      },
    ]);
  }

  // req.user is Available Due To The VerifyJWT Middleware Used before this Controller...
  const userID = req.user._id;

  try {
    // To ensure it's a proper ObjectId type, not just a string.....
    // userid: new mongoose.Types.ObjectId(userID)
    const newGig = await Gig.create({
      title,
      description,
      budget,
      ownerId: new mongoose.Types.ObjectId(userID),
      status: "open",
    });

    // If The Creation Of The Project Fails....
    if (!newGig) {
      throw new ApiError(400, "Project Creation Failed");
    }

    const currentGig = await Gig.findById(newGig._id).populate(
      "ownerId",
      "avatar username fullname email",
    );

    // Set cookies and redirect
    const response = new ApiResponse(
      200,
      currentGig,
      "New Gig Created successfully On GigFlow platform",
    );

    // Send All Projects To The Frontend....
    return res.status(response.statusCode).json(response);
  } catch (error) {
    // Handle any errors that occur during user creation
    throw new ApiError(500, "Internal server error", [
      {
        field: "server",
        message: "Internal server error In The createGig Controller",
      },
    ]);
  }
});

export { getGig, postGig };
