import express from "express"   
import { emailSendValidation, loginValidation, passwordChangeValidation, signupValidation } from './../middlewares/userValidation.js';
import { checkAuth, emailSendController, login, logoutUser, passwordChangeController, refreshToken, signup } from "../controllers/authController.js";
import { authLimiter } from './../middlewares/rateLimiter.js';
import { protect } from "../middlewares/authMiddleware.js";
const userRouter = express.Router();

userRouter.post("/signup",signupValidation,signup);  
userRouter.post("/login",authLimiter, loginValidation ,login);  
userRouter.post("/refresh-token",refreshToken);
userRouter.get("/is-auth",protect,checkAuth);  
userRouter.post("/logout",logoutUser);

userRouter.post("/email-send",emailSendValidation ,emailSendController);
userRouter.post("/change-password",passwordChangeValidation,passwordChangeController);

export default userRouter;