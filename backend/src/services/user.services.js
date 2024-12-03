import User from "../models/user.model.js";

const createUser = async (user) => {
    const newUser = await User.create(user);
    return newUser;
};

const getUserById = async (id) => {
    const user = await User.findById(id);
    return user;
};

const getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
};

const getUserByUsername = async (username) => {
    const user = await User.findOne({ username });
    return user;
};

export { createUser, getUserByEmail, getUserById, getUserByUsername };
