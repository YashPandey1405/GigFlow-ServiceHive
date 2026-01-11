import { getGig, postGig } from "../controllers/gig.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { Router } from "express";

const router = Router();

router.route("/").get(getGig).post(verifyJWT, postGig);

export default router;
