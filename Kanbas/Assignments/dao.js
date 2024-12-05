import Database from "../Database/index.js";
import model from "./model.js";

// find all assignments for a course
export async function findAssignmentsForCourse(courseId) {
    return await model.find({ course: courseId });
}

// create a new assignment
export async function createAssignment(assignment) {
    delete assignment._id;
    return await model.create(assignment);

}

export async function deleteAssignment(assignmentId) {
    return await model.deleteOne({ _id: assignmentId });
}

export async function updateAssignment(assignmentId, assignmentUpdates) {
    return await model.updateOne({ _id: assignmentId }, assignmentUpdates);
}