import express from "express"
import { addAddress, getAddress } from "../controllers/AddressController.js";
import { protect } from "../middlewares/authMiddleware.js";
const addressRouter = express.Router();

addressRouter.post("/add",protect,addAddress);
addressRouter.get("/get",protect,getAddress);
 
export default addressRouter;