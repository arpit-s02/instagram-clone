import Follow from "../models/follow.model.js";
import { followStatus } from "../utils/followStatusTypes.js";

const findUserFollowing = async (userId) => {
    const userFollowing = await Follow.find(
        {
            follower: userId,
            status: followStatus.ACCEPTED,
        },
        { createdAt: false, updatedAt: false, __v: false }
    );

    return userFollowing;
};

const findFollowRequest = async (followerId, followingId) => {
    const followRequest = await Follow.findOne({
        follower: followerId,
        following: followingId,
    });

    return followRequest;
};

const findFollowRequestById = async (followRequestId) => {
    const followRequest = await Follow.findById(followRequestId);
    return followRequest;
};

const createFollowRequest = async (followerId, followingId) => {
    await Follow.create({ follower: followerId, following: followingId });
};

const updateFollowRequest = async (followRequestId, updates) => {
    const updatedFollowRequest = await Follow.findByIdAndUpdate(
        followRequestId,
        updates,
        {
            overwrite: false,
            new: true,
        }
    );

    return updatedFollowRequest;
};

const removeFollowRequest = async (followRequestId) => {
    await Follow.findByIdAndDelete(followRequestId);
};

export {
    findUserFollowing,
    createFollowRequest,
    findFollowRequest,
    findFollowRequestById,
    updateFollowRequest,
    removeFollowRequest,
};
