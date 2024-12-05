import Like from "../models/likes.model.js";

const getLikes = async (targetId) => {
    const likes = await Like.find({ target: targetId }, { user });
    return likes;
}

const createLike = async (userId, targetId, targetModel) => {
    await Like.create({ user: userId, target: targetId, targetModel });
}

const deleteLike = async(id) => {
    await Like.findByIdAndDelete(id);
}

export { getLikes, createLike, deleteLike };