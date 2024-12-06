import Like from "../models/likes.model.js";

const getLikesById = async (targetId, page, limit) => {
    const skipCount = (page - 1) * limit;

    const aggregation = [
        // Step 1: Match the likes for the targetId
        { $match: { target: targetId } },

        // Step 2: Project only necessary fields (e.g., user) and add pagination
        { $project: { user: 1 } },

        // Step 3: Count the total number of likes for pagination
        {
            $facet: {
                totalLikes: [{ $count: "count" }],
                likesData: [{ $skip: skipCount }, { $limit: limit }],
            },
        },

        // Step 4: Unwind the totalLikes array to get the count
        {
            $project: {
                totalLikes: { $arrayElemAt: ["$totalLikes.count", 0] },
                likesData: 1,
            },
        },
    ];

    const result = await Like.aggregate(aggregation);

    const totalLikes = result[0].totalLikes || 0;
    const likesData = result[0].likesData;
    const totalPages = Math.ceil(totalLikes / limit);

    return {
        totalLikes,
        data: likesData,
        pagination: { currentPage: page, limit, totalPages },
    };
};

const createLike = async (userId, targetId, targetModel) => {
    await Like.create({ user: userId, target: targetId, targetModel });
};

const deleteLike = async (id) => {
    await Like.findByIdAndDelete(id);
};

export { getLikesById, createLike, deleteLike };
