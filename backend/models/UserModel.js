import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        minlength: [3, "Username must be at least 3 characters long"],
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        index: true 
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    role : {
        type: String,
        enum: ["user","admin"],
        default: "user"
    },
    refreshToken:{
        type: String
    },
    tokenVersion: {
        type: Number,
        default: 0,
    },
    cartItems: [
        {
            book:{
                type: Schema.Types.ObjectId,
                ref:"Book"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
},{timestamps:true,minimize:false})

const User = mongoose.model("User",userSchema);

export default User;