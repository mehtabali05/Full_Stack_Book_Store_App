import rateLimiter from "express-rate-limit";

export const authLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max : 5,
    message: "Too many attempts. Try again later."
});