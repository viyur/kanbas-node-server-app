import Database from "../Database/index.js";
import model from "./model.js";

// find all courses a user enrolled in
export async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
}

// find all users enrolled in a course
export async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    // Filter out null users
    return enrollments
        .map((enrollment) => enrollment.user)
        .filter((user) => user !== null); // Exclude null values
}

// enroll a user in a course
export async function enrollUserInCourse(user, course) {
    return await model.create({ user, course });
}

// unenroll a user from a course
export async function unenrollUserFromCourse(user, course) {
    return await model.deleteOne({ user, course });
}

// find all enrollments for a user
export async function findEnrollmentsForUser(userId) {
    const enrollments = await model.find({ user: userId }) // Find enrollments for the user
    return enrollments;
}






