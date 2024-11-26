// import db from "../Database/index.js"; // dao is useful when you switch databases
// let { users } = db;
import model from "./model.js"; // now instead of local db, we use mongoose model

export const createUser = async (user) => {
    delete user._id // mongo will add a new id for the user
    return await model.create(user);
}

export const findAllUsers = async () => {
    return await model.find();
};
export const findUserById = async (userId) => {
    return await model.findById(userId);
};
export const findUserByUsername = async (username) => {
    return await model.findOne({ username: username });
};
export const findUserByCredentials = async (username, password) => {
    return await model.findOne({ username, password });
};
export const updateUser = async (userId, user) => {
    return await model.updateOne({ _id: userId }, { $set: user });
};
export const deleteUser = async (userId) => {
    return await model.deleteOne({ _id: userId });
};

export const findUsersByRole = async (role) => { return await model.find({ role: role }) }; // or just model.find({ role })

export const findUsersByPartialName = async (partialName) => {
    const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
    return await model.find({
        $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
};

