import Database from "../Database/index.js";
export function enrollUserInCourse(userId, courseId) {
    const { enrollments } = Database;
    const newEnrollment = { _id: Date.now(), user: userId, course: courseId };
    console.log("dao is adding new enrollment: ", newEnrollment);
    Database.enrollments = [...enrollments, newEnrollment];
    return newEnrollment;
}

export function findEnrollmentsForUser(userId) {
    const { enrollments } = Database;
    return enrollments.filter((enrollment) => enrollment.user === userId);
}

export function deleteEnrollment(userId, courseId) {
    const { enrollments } = Database;
    const initialLength = enrollments.length;

    // Filter out the enrollment
    Database.enrollments = enrollments.filter(
        (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
    );

    // Return true if an enrollment was deleted
    return Database.enrollments.length < initialLength;
}


