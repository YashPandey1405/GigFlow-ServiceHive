import mongoose, { Schema } from "mongoose";
import { GigStatusEnum } from "../utils/constants.js";

const GigSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    budget: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: GigStatusEnum,
      default: GigStatusEnum.OPEN,
    },
  },
  { timestamps: true },
);

export const Gig = mongoose.model("Gig", GigSchema);
