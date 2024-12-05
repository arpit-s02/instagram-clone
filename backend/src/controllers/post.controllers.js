import ApiError from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { StatusCodes } from "http-status-codes";
import { createPost } from "../services/post.services.js";

const createNewPost = async (req, res, next) => {
    try {
        // extract media, caption and user id from req
        const media = req.files;
        const caption = req.body.caption || "";
        const user = req.user._id;

        // if media and caption both are not present throw error
        if(!media?.length && !caption) throw new ApiError("One of media or caption is required", StatusCodes.BAD_REQUEST);
        
        // create an array of urls of uploaded media
        const mediaUrls = [];

        // if media is present upload the files to cloudinary
        if(media) {
            const promises = media.map(item => uploadToCloudinary(item.path));
            const results = await Promise.all(promises);
            results.forEach(result => mediaUrls.push(result.url));
        }

        // create a new post in db and pass media urls array, caption and user id
        await createPost({ media: mediaUrls, caption, user });
        
        // send a response
        return res.status(StatusCodes.CREATED).send({ message: "Post created successfully" });
    } catch (error) {
        next(error);
    }
}

export { createNewPost };