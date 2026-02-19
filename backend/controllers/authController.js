import asyncHandler from "../middlewares/asyncHandler.js";
import { registerUser, loginUser, createTokens } from "../services/authService.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import { generateAccessToken } from "../utils/tokenService.js";
import Otp from "../models/OtpModel.js";
import { sendMail } from "../utils/mailer.js";
import crypto from "crypto";
import ApiError from "../middlewares/ApiError.js";

export const signup = asyncHandler(async (req, res) => {

    const user = await registerUser(req.body);

    const { accessToken, refreshToken } = await createTokens(user);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        message: "User registered successfully"
    });
});

export const login = asyncHandler(async (req,res) => {
    const user = await loginUser(req.body);

    const {accessToken,refreshToken} = await createTokens(user);

    res.cookie("accessToken",accessToken,{
        httpOnly: true,
        maxAge: 15 * 60 *1000
    });

    res.cookie("refreshToken",refreshToken,{
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        message: "User logged in successfully"
    })
});

export const refreshToken = asyncHandler(async (req, res) => {

    const incomingToken = req.cookies.refreshToken;

    if (!incomingToken)
        throw new ApiError(401, "No refresh token provided");

    let decoded;
    try {
        decoded = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new ApiError(401,"Invalid refresh token");
    }
    

    const user = await User.findById(decoded.id);

    if (!user)
        throw new ApiError(401, "Invalid refresh token");

    const hashedIncoming = crypto.createHash("sha256").update(incomingToken).digest("hex");
    if(user.refreshToken !== hashedIncoming)
        throw new ApiError(401,"Refresh Token mismatch");

    if(user.tokenVersion !== decoded.tokenVersion)
        throw new ApiError(401,"Token invalidated");

    const {accessToken, refreshToken: newRefreshToken} = await createTokens(user);

    // const newAccessToken = generateAccessToken(user);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken",newRefreshToken,{
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ success: true });
});

export const checkAuth = asyncHandler(async (req,res) => {
        const userId = req.user;
        const user = await User.findById(userId).select("-password");
        if(!user){
            throw new ApiError(404,"User Not Found");
        }

        return res.status(200).json({
            success: true,
            user
        });
}); 
  

export const logoutUser = asyncHandler(async (req,res) => {
    const {refreshToken} = req.cookies;
    if(refreshToken){
        const hashed = crypto.createHash("sha256").update(refreshToken).digest("hex");

        await User.findOneAndUpdate(
            {refreshToken: hashed},
            {refreshToken: null}
        );
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
        success: true,
        message: "User Logged out successfully"
    })
});

export const emailSendController = asyncHandler(async (req, res) => {
        const { email } = req.body;

        const emailExists = await User.findOne({ email });
        if (!emailExists) throw new ApiError(404,"User not found");

        const otpCode = Math.floor(100000 + Math.random() * 900000);
        
        const otpData = new Otp({
            email,
            otp: await bcrypt.hash(otpCode.toString(),10),
            expireIn: Date.now() + 5 * 60 * 1000,
        });

        await otpData.save();

        // mailer(otpCode, email);
        await sendMail(email,"Your OTP Code",`Your OTP Code is ${otpCode}`);
        
        return res.status(200).json({
            success: true, 
            message: "OTP sent to your email",
        });
});

export const passwordChangeController = asyncHandler(async (req, res) => {
        const { email, otp, confirmPassword } = req.body;
        const newPassword = confirmPassword;

        // const data = await Otp.findOne({ email, otp });
        const data = await Otp.findOne({ email});
        if (!data) throw new ApiError(400,"Invalid OTP");

        const isMatch = await bcrypt.compare(otp.toString(),data.otp);
        if(!isMatch) throw new ApiError(400,"Invalid OTP");

        let currentTime = new Date().getTime();
        const diff = data.expireIn - currentTime;
        if (diff < 0) {
            await Otp.deleteMany({ email });
            throw new ApiError(404,"OTP Expired");
        }else{
            const user = await User.findOne({ email });
            if(!user) throw new ApiError(400,"User not found");
            user.password = await bcrypt.hash(newPassword, 10);
            user.tokenVersion += 1;
            user.refreshToken = null;
            await user.save();
            await Otp.deleteMany({email});
            return res.status(200).json({
                success: true,
                message: "Password changed successfully",
            }); 
        }
});
 