import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

// Common Method To Generate Access And Refresh Tokens....
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save the refresh token in the database for the user.....
    user.refreshToken = refreshToken;

    // Save The Refresh Token Without Validating The User Model....
    // This is useful when you want to update a field without triggering validation rules.
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    res
      .status(500)
      .send("Something went wrong while generating referesh and access token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get data from request body
  const { email, username, fullname, password } = req.body;

  //validation Of The Input Fields....
  const errors = [];
  if (!email) errors.push({ field: "email", message: "Email is required" });
  if (!username)
    errors.push({ field: "username", message: "Username is required" });
  if (!fullname)
    errors.push({ field: "fullname", message: "Fullname is required" });
  if (!password)
    errors.push({ field: "password", message: "Password is required" });
  // if (!role) errors.push({ field: "role", message: "Role is required" });

  if (errors.length > 0) {
    throw new ApiError(400, "All fields are required", errors);
  }

  // Get The Local Path Of The Image Uploaded By The Multer.....
  const localFilePath = req.file?.path;

  // If The LocalPath Isn't Got Created , Throw Error....
  if (!localFilePath) {
    throw new ApiError(500, "File Not Got Uploaded On The Server", [
      { field: "Image", message: "File Not Got Uploaded On The Server" },
    ]);
  }

  // Variale Which Will Actually Hold An Cloudinary Public URL.....
  let imageUrl = null;

  // Now , We Will Upload On The Cloudinary Cloud Service.....
  if (localFilePath) {
    const cloudinaryResult = await uploadOnCloudinary(localFilePath);

    if (!cloudinaryResult) {
      return res.status(500).json({ message: "Failed to upload image" });
    }

    imageUrl = cloudinaryResult.secure_url;
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    // If user already exists, throw an error.....
    if (existingUser) {
      if (existingUser.email === email) {
        throw new ApiError(400, "Email already exists", [
          { field: "email", message: "Email already exists" },
        ]);
      } else if (existingUser.username === username) {
        throw new ApiError(400, "Username already exists", [
          { field: "username", message: "Username already exists" },
        ]);
      }
    }

    // Creates a new User document & Saves it to your MongoDB database.
    // await newUser.save(); --> No need as it's already saved in the create method
    const newUser = await User.create({
      email,
      username,
      fullname,
      password,
      avatar: {
        url: imageUrl,
      },
    });

    // If the user is not created, throw an error.....
    if (!newUser) {
      throw new ApiError(400, "User not created", [
        { field: "user", message: "User not created" },
      ]);
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      newUser._id,
    );

    // Get Above Created user info without password & refreshToken
    const loggedInUser = await User.findById(newUser._id).select(
      "-password -refreshToken",
    );

    // Cookie options
    const options = {
      httpOnly: true,
      secure: true,
    };

    // Set cookies and redirect
    const response = new ApiResponse(
      200,
      loggedInUser,
      "Signup successful On GigFlow Platform",
    );

    // Set cookies for access and refresh tokens & send response.....
    return res
      .status(response.statusCode)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(response);
  } catch (error) {
    // Handle any errors that occur during user creation
    throw new ApiError(500, "Internal server error", [
      {
        field: "server",
        message: "Internal server error In The registerUser Controller",
      },
    ]);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  // get data from request body
  const { email, username, password } = req.body;

  //validation
  const errors = [];
  if (!email) errors.push({ field: "email", message: "Email is required" });
  if (!username)
    errors.push({ field: "username", message: "Username is required" });
  if (!password)
    errors.push({ field: "password", message: "Password is required" });
  // if (!role) errors.push({ field: "role", message: "Role is required" });

  if (errors.length > 0) {
    throw new ApiError(400, "All fields are required", errors);
  }

  try {
    // Check For The User Existence.....
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    // If user doesn't exist, throw an error.....
    if (!existingUser) {
      throw new ApiError(400, "Invalid credential", [
        { field: "credentials", message: "User Does Not Exist" },
      ]);
    }

    // We Have To Use The Object Instance Of The User Model.....
    // 'isPasswordCorrect' is a method defined in the User model that checks
    // if the provided password matches the hashed password stored in the database.
    const isPasswordCorrect = await existingUser.isPasswordCorrect(password);

    // When the password is incorrect....
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid credential", [
        { field: "credentials", message: "Invalid password Entered" },
      ]);
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      existingUser._id,
    );

    const loggedInUser = await User.findById(existingUser._id).select(
      "-password -refreshToken ",
    );

    // Cookie options
    const options = {
      httpOnly: true,
      secure: true,
    };

    // Set cookies and redirect
    const response = new ApiResponse(
      200,
      loggedInUser,
      "Login successful On GigFlow Platform",
    );

    // Set cookies for access and refresh tokens & send response.....
    return res
      .status(response.statusCode)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(response);
  } catch (error) {
    // Handle any errors that occur during user creation
    throw new ApiError(500, "Internal server error", [
      {
        field: "server",
        message: "Internal server error In The loginUser Controller",
      },
    ]);
  }

  //validation
});

const logoutUser = asyncHandler(async (req, res) => {
  // req.user is Available Due To The VerifyJWT Middleware Used before this Controller...

  // Await the update operation on the User model, finding the user by their ID
  await User.findByIdAndUpdate(
    req.user._id, // The ID of the currently authenticated user (from the request object)

    {
      // Update operation: using $unset to remove the 'refreshToken' field from the document
      $unset: {
        refreshToken: 1, // '1' indicates the field should be removed (MongoDB syntax)
      },
    },

    {
      new: true, // Option to return the updated document (though it's not stored here)
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  // Set cookies and redirect
  const response = new ApiResponse(
    200,
    "Logout successful On GigFlow Platform",
  );

  // Set cookies for access and refresh tokens & send response.....
  return res
    .status(response.statusCode)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(response);
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const userID = req.params.userID;
  console.log("UserID in getCurrentUser:", userID);
});

export { getCurrentUser, loginUser, logoutUser, registerUser };
