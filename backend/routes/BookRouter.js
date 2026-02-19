import express from "express";
// import { authAdmin } from './../middlewares/authAdmin.js';
import { addBook, deleteBook, getBooks } from "../controllers/bookController.js";
import { upload } from "../config/multer.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/authorize.js";
const bookRouter = express.Router();

bookRouter.post("/add",protect,authorizeRole("admin"),upload.single("image"),addBook); 
bookRouter.get("/get-books",getBooks); 
bookRouter.delete("/delete-book/:id",protect,authorizeRole("admin"),deleteBook); 

export default bookRouter;