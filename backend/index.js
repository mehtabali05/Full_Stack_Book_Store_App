import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from "express"
import dotenv from "dotenv"
dotenv.config();

import cookieParser from "cookie-parser"
import cors from "cors"

// ROUTES IMPORTS
import { connectDB } from "./config/connectDB.js";
import userRouter from "./routes/UserRouter.js";
import bookRouter from "./routes/BookRouter.js";
import cartRouter from "./routes/CartRouter.js";
import orderRouter from "./routes/OrderRouter.js";
import addressRouter from "./routes/AddressRouter.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import helmet from 'helmet';
import rateLimit from "express-rate-limit";
import compression from "compression";
import hpp from "hpp";
// import mongoSanitize from "express-mongo-sanitize";

const app = express();
const PORT = process.env.PORT || 8080;
const limiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100,
    message : "Too many requests from this IP, please try again later !"
});

if(!process.env.CLIENT_URL){
    throw new Error("CLIENT_URL not defined in environment variables");
}

// DATABASE 
connectDB();

// MIDDLEWARES
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true,
    methods: ["GET", "POST", "PUT", "PATCH","DELETE"],
    allowedHeaders: ["Content-Type","Authorization"]
}));
app.use(limiter);
app.use(compression());
// app.use(mongoSanitize());
app.use(hpp());

app.use("/user/login",rateLimit({
    windowMs : 15 * 60 * 1000,
    max: 5,
    message: "Too many requests, please try again later"
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.use("/images",express.static("uploads",{
    maxAge: "7d",
    etag: true
}));

app.use("/user",userRouter);
app.use("/book",bookRouter);
app.use("/cart",cartRouter);
app.use("/order",orderRouter);
app.use("/address",addressRouter);

// GLOBAL ERROR HANDLER
app.use(errorHandler);

app.listen( PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

