import model from "./model.js";

// find all courses
export async function findAllCourses() {
    return await model.find();
}

export function findCoursesForEnrolledUser(userId) {
    const { courses, enrollments } = Database;
    const enrolledCourses = courses.filter((course) =>
        enrollments.some((enrollment) => enrollment.user === userId && enrollment.course === course._id));
    return enrolledCourses;
}

// create a new course
export async function createCourse(course) {
    delete course._id;
    return await model.create(course);
}    // Enrollments should update as well

// delete a course
export async function deleteCourse(courseId) {
    return await model.deleteOne({ _id: courseId });
}

// update a course
export async function updateCourse(courseId, courseUpdates) {
    return await model.updateOne({ _id: courseId }, courseUpdates);
}

// find a course by id
export async function findCourseById(courseId) {
    return await model.findOne({ _id: courseId });
}



