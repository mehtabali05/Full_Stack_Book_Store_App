import {body, validationResult} from "express-validator"
import ApiError from "./ApiError.js";

export const signupValidation = [
    body("name").notEmpty().withMessage("Name is required")
        .isLength({min: 3}).withMessage("Name must be at least 3 characters"),
    
    body("email").notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email formate")
        .normalizeEmail(),
    
    body("password").notEmpty().withMessage("Password is required")
        .isLength({min: 6}).withMessage("Password must be at least 6 characters")
        .matches(/\d/).withMessage("Password must contain a number"),

    (req,res,next) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            throw new ApiError(400,errors.array());
        }
        next();
    }
];

export const loginValidation = [
    body("email").notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),

    body("password").notEmpty().withMessage("Password is required")
        .isLength({min: 6}).withMessage("Password must be at least 6 characters")
        .matches(/\d/).withMessage("Password must contain a number"),

    (req,res,next) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            throw new ApiError(400,errors.array());
        }
        next();
    }
];

export const emailSendValidation = [
    body("email").notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),

    (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            throw new ApiError(400,errors.array());
        }
        next();
    }
];

export const passwordChangeValidation = [
    body("email").notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),

    body("otp").notEmpty().withMessage("Otp is required"),
        
    body("confirmPassword").notEmpty().withMessage("Password is required")
        .isLength({min: 6}).withMessage("Password must be at least 6 characters")
        .matches(/\d/).withMessage("Password must contain a number"),

    (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            throw new ApiError(400,errors.array());
        }
        next();
    }
];