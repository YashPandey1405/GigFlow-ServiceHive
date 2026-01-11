import mongoose, { Schema } from "mongoose";
import { BidStatusEnum } from "../utils/constants.js";

const BidSchema = new Schema(
  {
    gigId: {
      type: Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: BidStatusEnum,
      default: BidStatusEnum.PENDING,
    },
  },
  { timestamps: true },
);

export const Bid = mongoose.model("Bid", BidSchema);
