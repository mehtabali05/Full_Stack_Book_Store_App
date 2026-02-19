import express from "express"
import bodyParser from "body-parser";
import { createCheckoutSessionController, deleteFailedOrder, getAllOrders, getUserOrders,placeOrder, stripeWebhookHandler } from "../controllers/OrderController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/authorize.js";

const orderRouter = express.Router();

orderRouter.post("/webhook",bodyParser.raw({ type: "application/json" }), stripeWebhookHandler);
orderRouter.post("/place-order", protect, placeOrder);  
orderRouter.post("/create-checkout-session", protect,createCheckoutSessionController);
orderRouter.get("/user",protect,getUserOrders); 
orderRouter.get("/admin",protect,authorizeRole("admin"),getAllOrders); 
orderRouter.delete("/delete-failed/:orderId", deleteFailedOrder);
export default orderRouter;  