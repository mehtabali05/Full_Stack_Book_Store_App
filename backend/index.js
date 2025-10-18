import express from "express"
import dotenv from "dotenv"
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryConfig = cloudinary;
import cookieParser from "cookie-parser"
import cors from "cors"
import { connectDB } from "./config/connectDB.js";
import userRouter from "./routes/UserRouter.js";
import adminRouter from "./routes/AdminRouter.js";
import bookRouter from "./routes/BookRouter.js";
import cartRouter from "./routes/CartRouter.js";
import orderRouter from "./routes/OrderRouter.js";
import addressRouter from "./routes/AddressRouter.js";

const app = express();
const PORT = process.env.PORT || 8080;

// DATABASE 
// connectDB();

// MIDDLEWARES
// app.use(cors({origin: process.env.CLIENT_URL,
//     credentials:true
// }));

let allowedOrigin;
if (process.env.NODE_ENV === 'production') {
    // Vercel's production environment
    allowedOrigin = process.env.CLIENT_URL; 
} else {
    // Vercel's preview environment or local dev
    // Check for a specific Preview URL if available, otherwise default to a wildcard for local/preview ease
    allowedOrigin = process.env.CLIENT_URL_PREVIEW || 'http://localhost:3000'; 
}

// CORS Configuration
app.use(cors({
    origin: allowedOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // IMPORTANT for cookies/sessions/auth tokens
    optionsSuccessStatus: 204
}));

// Add a specific handler for the OPTIONS (preflight) request that Vercel often requires
app.options('*', cors({
    origin: allowedOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}));
// app.use(express.json());
// Only skip express.json for the webhook path:
app.use((req, res, next) => {
    if (req.originalUrl === "/order/webhook") {
      return next(); // keep raw body for Stripe webhook route
    } else {
      return express.json()(req, res, next);
    }
});
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.use("/images",express.static("uploads"));
app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/book",bookRouter);
app.use("/cart",cartRouter);
app.use("/order",orderRouter);
app.use("/address",addressRouter);

// API ENDPOINTS 
app.get("/",(req,res) => {
    res.send("Welcome to the Server");
});

// app.listen(PORT,()=>{
//     console.log(`Server is listening on port ${PORT}`);
// })


export default app;