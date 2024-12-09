import User from "../models/user.model.js";

const createUser = async (user) => {
    const newUser = await User.create(user);
    return newUser;
};

const findUserById = async (id) => {
    const user = await User.findById(id);
    return user;
};

const findUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
};

const findUserByUsername = async (username) => {
    const user = await User.findOne({ username });
    return user;
};

export { createUser, findUserByEmail, findUserById, findUserByUsername };
