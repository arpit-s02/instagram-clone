import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        target: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'targetModel',
            required: true
        },
        targetModel: {
            type: String,
            enum: ['Like', 'Comment', 'Follow'],
            required: true
        },
        read: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;