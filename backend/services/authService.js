import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import ApiError from "../middlewares/ApiError.js";
import crypto from "crypto";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenService.js";

export const registerUser = async ({ name, email, password }) => {

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(400, "User already exists");

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    return user;
};

export const loginUser = async ({ email, password }) => {

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(400, "Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(400, "Invalid credentials");

    return user;
};

export const createTokens = async (user) => {

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
    user.refreshToken = hashedRefreshToken;
    await user.save();

    return { accessToken, refreshToken };
};
 