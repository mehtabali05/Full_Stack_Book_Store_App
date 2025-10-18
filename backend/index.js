// import express from "express"
// import dotenv from "dotenv"
// dotenv.config();

// import cookieParser from "cookie-parser"
// import cors from "cors"
// import { connectDB } from "./config/connectDB.js";
// import userRouter from "./routes/UserRouter.js";
// import adminRouter from "./routes/AdminRouter.js";
// import bookRouter from "./routes/BookRouter.js";
// import cartRouter from "./routes/CartRouter.js";
// import orderRouter from "./routes/OrderRouter.js";
// import addressRouter from "./routes/AddressRouter.js";

// const app = express();
// // const PORT = process.env.PORT || 8080;

// // const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

// // DATABASE 
// connectDB();
// // connectDB().catch(err => {
// //   console.error("DB connection failed on startup:", err);
// //   // do NOT throw here — we want the function to load, but log the problem
// // });

// // MIDDLEWARES
// // app.use(cors({origin: clientUrl,
// //     credentials:true
// // }));

// // Manual CORS middleware with cookie support
// app.use((req, res, next) => {
//   const allowedOrigins = [
//     'https://bookstore-app-rosy.vercel.app',
//     'http://localhost:3000'
//   ];
//   const origin = req.headers.origin;
  
//   if (allowedOrigins.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
  
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cookie, Set-Cookie');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Expose-Headers', 'Set-Cookie');
  
//   // Handle preflight requests
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }
  
//   next();
// });

// // const allowedOrigins = [
// //   "https://bookstore-delta-peach.vercel.app",
// //   "https://bookstore-git-main-mehtabali05s-projects.vercel.app",
// //   "https://bookstore-68e2aicay-mehtabali05s-projects.vercel.app",
// // ];

// // app.use(
// //   cors({
// //     origin: function (origin, callback) {
// //       // allow REST tools or no-origin like mobile apps/postman
// //       if (!origin) return callback(null, true);
// //       if (allowedOrigins.includes(origin)) {
// //         return callback(null, true);
// //       } else {
// //         return callback(new Error("Not allowed by CORS"));
// //       }
// //     },
// //     credentials: true,
// //   })
// // );

// // app.use(
// //   cors({
// //     origin(origin, cb) {
// //       if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
// //       return cb(new Error("Not allowed by CORS"));
// //     },
// //     credentials: true,
// //   })
// // );



// // app.use(express.json());
// // Only skip express.json for the webhook path:
// app.use((req, res, next) => {
//     if (req.originalUrl === "/order/webhook") {
//       return next(); // keep raw body for Stripe webhook route
//     } else {
//       return express.json()(req, res, next);
//     }
// });
// app.use(express.urlencoded({extended: true}));
// app.use(cookieParser());


// app.use("/images",express.static("uploads"));
// app.use("/user",userRouter);
// app.use("/admin",adminRouter);
// app.use("/book",bookRouter);
// app.use("/cart",cartRouter);
// app.use("/order",orderRouter);
// app.use("/address",addressRouter);

// // API ENDPOINTS 
// app.get("/",(req,res) => {
//     res.send("Welcome to the Server");
// });


// // app.use((err, req, res, next) => {
// //   console.error("SERVER ERROR:", err);
// //   res.status(500).json({ success: false, message: "Internal Server Error" });
// // });



// app.listen(process.env.PORT || 8080, () => {
//     console.log(`Server is running on port ${process.env.PORT || 8080}`);
// });

// // export default function handler(req, res) {
// //   return app(req, res);
// // } 

// export default app;

import express from "express"
import dotenv from "dotenv"
dotenv.config();

import cookieParser from "cookie-parser"
import { connectDB } from "./config/connectDB.js";
import userRouter from "./routes/UserRouter.js";
import adminRouter from "./routes/AdminRouter.js";
import bookRouter from "./routes/BookRouter.js";
import cartRouter from "./routes/CartRouter.js";
import orderRouter from "./routes/OrderRouter.js";
import addressRouter from "./routes/AddressRouter.js";

const app = express();

console.log("🚀 Server starting...");

// MANUAL CORS MIDDLEWARE - SIMPLIFIED
app.use((req, res, next) => {
  console.log(`📨 Incoming ${req.method} request to: ${req.url}`);
  
  const allowedOrigins = [
    'https://bookstore-app-rosy.vercel.app',
    'http://localhost:3000'
  ];
  const origin = req.headers.origin;
  
  console.log(`🌐 Origin: ${origin}`);
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    console.log("✅ Handling OPTIONS preflight");
    return res.status(200).end();
  }
  
  next();
});

// DATABASE with error handling
console.log("🔗 Connecting to database...");
connectDB().catch(err => {
  console.error("❌ Database connection failed:", err);
});

// MIDDLEWARES with error handling
app.use((req, res, next) => {
  try {
    if (req.originalUrl === "/order/webhook") {
      return next();
    } else {
      return express.json()(req, res, next);
    }
  } catch (error) {
    console.error("❌ JSON middleware error:", error);
    next(error);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES with error handling
console.log("🛣️ Setting up routes...");
app.use("/images", express.static("uploads"));
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/book", bookRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/address", addressRouter);

// TEST ENDPOINT - Add this to verify server is working
app.get("/test", (req, res) => {
  console.log("✅ Test endpoint hit");
  res.json({ 
    message: "Server is working!",
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for books specifically
app.get("/book/test", (req, res) => {
  console.log("✅ Book test endpoint hit");
  res.json({ 
    message: "Book route is working!",
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Server");
});

// GLOBAL ERROR HANDLER - ADD THIS
app.use((err, req, res, next) => {
  console.error("💥 GLOBAL ERROR:", err);
  res.status(500).json({ 
    success: false, 
    message: "Internal Server Error",
    error: err.message 
  });
});

// 404 HANDLER
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    success: false, 
    message: "Route not found" 
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

export default app;