import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    media: [
      {
        type: String,
      },
    ],
    caption: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
