import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validate user details - not empty
    // check if user already exists in the database: username, email
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object - create entry in the database(db)
    // remove password and refresh token field from response
    // check for user creation
    // return response


    const { fullname, email, username, password } = req.body
    console.log("fullname:", fullname);
    console.log("email:", email);
    console.log("username:", username);

    // if(fullname === "") {
    //     throw new ApiError(400,"Fullname is required");
    // }
    // if(email === "") {
    //     throw new ApiError(400, "Email is required");
    // }
    // if(username === "") {
    //     throw new ApiError("Username is required");
    // }

    // both are the options to check if any of the fields are empty, but the second one is more concise and readable. It checks if any of the fields are empty and throws an error if so.

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(500, "Avatar upload failed");
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "User registration failed");
    }

    return res.status(201).json(
        new ApiResponse(201, "User registered successfully", createdUser)
    );
});

export { registerUser };