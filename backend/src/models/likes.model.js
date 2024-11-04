import mongoose from "mongoose";

const likesSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        target: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'targetModel', // ref would be equal to value of targetModel
            required: true
        },
        targetModel: {
            type: String,
            enum: ['Post', 'Comment'],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Likes = mongoose.model('Likes', likesSchema);

export default Likes;