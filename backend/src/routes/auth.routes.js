import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/auth.controllers.js";

// Express-Validator Import.....
import {
  userLoginValidator,
  userRegistrationValidator,
} from "../validatores/index.js";

// Middlewares Import.....
import { validate } from "../middlewares/validator.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middlewares.js";

import { Router } from "express";

const router = Router();

// Login & Signup Route Which Needs Validation Before Save....
router.route("/login").post(userLoginValidator(), validate, loginUser);
router
  .route("/register")
  .post(
    upload.single("profileImage"),
    userRegistrationValidator(),
    validate,
    registerUser,
  );

router.route("/get-user/:userID").get(getCurrentUser);

// Routes & Controllers Which Need User Authorization & '_id'....
router.route("/logout").post(logoutUser);
// router.route("/logout").post(verifyJWT, logoutUser);

export default router;
