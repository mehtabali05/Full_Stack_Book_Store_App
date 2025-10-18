import express from "express"
import dotenv from "dotenv"
dotenv.config();

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
// const PORT = process.env.PORT || 8080;

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

// DATABASE 
connectDB();
// connectDB().catch(err => {
//   console.error("DB connection failed on startup:", err);
//   // do NOT throw here — we want the function to load, but log the problem
// });

// MIDDLEWARES
app.use(cors({origin: clientUrl,
    credentials:true
}));



// const allowedOrigins = [
//   "https://bookstore-delta-peach.vercel.app",
//   "https://bookstore-git-main-mehtabali05s-projects.vercel.app",
//   "https://bookstore-68e2aicay-mehtabali05s-projects.vercel.app",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // allow REST tools or no-origin like mobile apps/postman
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// app.use(
//   cors({
//     origin(origin, cb) {
//       if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
//       return cb(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//   })
// );



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


// app.use((err, req, res, next) => {
//   console.error("SERVER ERROR:", err);
//   res.status(500).json({ success: false, message: "Internal Server Error" });
// });

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port ${process.env.PORT || 8080}`);
});

// export default function handler(req, res) {
//   return app(req, res);
// } 