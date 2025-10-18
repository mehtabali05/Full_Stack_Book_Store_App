// import cloudinary from "../index.js";
// import { cloudinaryConfig } from "../index.js";
import Book from "../models/BookModel.js";
import mongoose from "mongoose";
import { getCloudinary } from "../utils/cloudinary.js";

// add a new book => /book/add
export const addBook = async (req,res) => {
    try {
        const cloudinary = getCloudinary();
        const {
            title,
            author,
            description, 
            price,
            offerPrice,
            category,
            rating,
            reviews,
        } = req.body;
        // console.log("Request body",req.body);

        if (!title || !author || !description || !price || !offerPrice || !category || !rating || !reviews) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const file = req.file.path;
        const uploadResult = await cloudinary.uploader.upload(file, {
            folder: 'bookstore', // 🆕 optional folder name in Cloudinary
        });
        const image = uploadResult.secure_url;
        // console.log("Cloudinary upload result",uploadResult);
        const book = await Book.create({
            title,
            author,
            description,
            price,
            offerPrice,
            category,
            rating, 
            reviews, 
            image,
        });

        return res.status(201).json({
            success: true,
            message: "Book added successfully!",
            book,
          });
    } catch (error) {
        // console.log("Error during add book",error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// get All books => /book/get-books
export const getBooks = async (req,res) => {
    try {
        // console.log("GET /book/get-books HIT");
        const books =  await Book.find();
        return res.status(200).json({
            success: true,
            books,
        });
    } catch (error) {
        // console.log("Error fetching all books",error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid book ID format",
            });
        }

        // ✅ Attempt to delete book
        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        // ✅ Return success response
        return res.status(200).json({
            success: true,
            message: "Book deleted successfully",
        });

    } catch (error) {
        console.error("❌ Error deleting book:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the book",
            error: error.message,
        });
    }
};