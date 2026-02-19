import jwt from "jsonwebtoken";
import ApiError from "./ApiError.js";
import User from "../models/UserModel.js";

export const protect = async (req,res,next) => {
    const {accessToken} = req.cookies;

    if(!accessToken)
        return next(new ApiError(401,"Unauthorized"));

    let decoded;
    try {
        decoded = jwt.verify(accessToken,process.env.JWT_ACCESS_SECRET);
    } catch (error) {
        return next(new ApiError(401,"Invalid or expired token"));
    }
    const user = await User.findById(decoded.id);
    if(!user)
        return next(new ApiError(404,"User not found"));

    if(user.tokenVersion !== decoded.tokenVersion)
        return next(new ApiError(401,"Token invalidated"));

    req.user = {
        id: user._id,
        role: user.role
    }

    next();
}