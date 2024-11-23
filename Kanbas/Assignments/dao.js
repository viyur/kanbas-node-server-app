import Database from "../Database/index.js";
export function findAssignmentsForModule(courseId) {
    const { assignments } = Database;
    return assignments.filter((a) => a.course === courseId);
}

export function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: Date.now().toString() };
    Database.assignments = [...Database.assignments, newAssignment];
    return newAssignment;
}

export function deleteAssignment(assignmentId) {
    const { assignments } = Database;
    Database.assignments = assignments.filter(
        (assignment) => assignment._id !== assignmentId
    );
}

export function updateAssignment(assignmentId, assignmentUpdates) {
    const { assignments } = Database;
    const assignmentIndex = assignments.findIndex(
        (assignment) => assignment._id === assignmentId
    );
    const updatedAssignment = {
        ...assignments[assignmentIndex],
        ...assignmentUpdates,
    };
    Database.assignments = [
        ...assignments.slice(0, assignmentIndex),
        updatedAssignment,
        ...assignments.slice(assignmentIndex + 1),
    ];
    return updatedAssignment;
}