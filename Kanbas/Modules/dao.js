import model from "./model.js";
import Database from "../Database/index.js";

// create a new module
export async function createModule(module) {
    delete module._id
    return await model.create(module);
}

// find modules for a course
export async function findModulesForCourse(courseId) {
    return await model.find({ course: courseId });
}

// Delete a Module
export async function deleteModule(moduleId) {
    return await model.deleteOne({ _id: moduleId });
}

// Update a Module
export async function updateModule(moduleId, moduleUpdates) {
    return await model.updateOne({ _id: moduleId }, moduleUpdates);
}





