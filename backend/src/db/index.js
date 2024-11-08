import mongoose from "mongoose";
import { MONGODB_URI } from "../../config.js";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");
        
    } catch (error) {
        next(error);
    }
}

export default connectDB;