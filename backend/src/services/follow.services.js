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

export { findUserFollowing };
