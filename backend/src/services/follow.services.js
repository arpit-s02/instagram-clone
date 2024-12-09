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

const createFollowRequest = async (followerId, followingId) => {
    await Follow.create({ follower: followerId, following: followingId });
};

export { findUserFollowing, createFollowRequest, findFollowRequest };
