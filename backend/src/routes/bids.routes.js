import {
  getAllBidsOnGig,
  postBid,
  registerBid,
} from "../controllers/bids.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { Router } from "express";

const router = Router();

router.route("/:gigId").get(getAllBidsOnGig);
router.route("/").post(verifyJWT, postBid);
router.route("/:bidId/hire").patch(verifyJWT, registerBid);

export default router;
