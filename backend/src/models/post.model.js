import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        media: {
            type: String
        },
        caption: {
            type: String
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

// validates that one of caption and media must be present
postSchema.pre('validate', (next) => {
    if(!this.media && !this.caption) {
        next(new Error('At least one of "media" and "caption" must be present'));
    }
    else {
        next();
    }
});

const Post = mongoose.model('Post', postSchema);

export default Post;