import express from "express";
import { updateCart } from "../controllers/CartController.js";
import { protect } from "../middlewares/authMiddleware.js";
const cartRouter = express.Router();

cartRouter.post("/update",protect,updateCart); 

export default cartRouter; 