import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as assignmentsDao from "../Assignments/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import * as quizzesDao from "../Quizzes/dao.js";

export default function CourseRoutes(app) {
    // get all courses
    app.get("/api/courses", async (req, res) => {
        const courses = await dao.findAllCourses();
        res.send(courses);
    });

    // get all users for a course
    app.get("/api/courses/:cid/users", async (req, res) => {
        const { cid } = req.params;
        const users = await enrollmentsDao.findUsersForCourse(cid);
        res.json(users);
    });

    // create a course and enroll current user
    app.post("/api/courses", async (req, res) => {
        try {
            // Validate the request body
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).send({ error: "Course data is required when creating new course." });
            }
            // Attempt to create the course
            const course = await dao.createCourse(req.body);
            // Enroll the current user if logged in
            const currentUser = req.session["currentUser"];
            if (currentUser) {
                try {
                    await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
                } catch (enrollmentError) {
                    console.error("Error enrolling user in course after new course created:", enrollmentError);
                    return res.status(500).send({ error: "Failed to enroll user in the newly created course." });
                }
            }
            // Respond with the created course
            res.status(201).json(course); // 201: Resource successfully created
        } catch (error) {
            console.error("Error creating course:", error);
            // Specific error handling
            if (error.name === "ValidationError") {
                return res.status(400).send({ error: error.message });
            }
            // Generic server error
            res.status(500).send({ error: "An internal server error occurred." });
        }
    });

    // Delete a course and unenroll the current user
    app.delete("/api/courses/:courseId", async (req, res) => {
        const { courseId } = req.params;
        try {
            const status = await dao.deleteCourse(courseId);
            if (status.deletedCount === 1) {
                const currentUser = req.session["currentUser"];
                if (currentUser) {
                    try {
                        await enrollmentsDao.unenrollUserFromCourse(currentUser._id, courseId);
                    } catch (enrollmentError) {
                        console.error("Error unenrolling user after course deleted:", enrollmentError);
                        return res.status(500).send({ error: "Failed to unenroll user after course deleted." });
                    }
                }
                // Successful deletion
                return res.status(200).send({ success: true, message: "Course deleted successfully." });
            } else {
                // No course found
                return res.status(404).send({ success: false, message: "Course not found when trying to delete." });
            }
        } catch (error) {
            // Handle errors (e.g., invalid courseId, database issues)
            console.error("Error deleting course:", error);
            return res.status(500).send({ success: false, message: "Internal server error.", error: error.message });
        }
    });

    // Update a course
    app.put("/api/courses/:courseId", async (req, res) => {
        const { courseId } = req.params;
        const courseUpdates = req.body;
        // Validate input
        if (!courseId || !courseUpdates || Object.keys(courseUpdates).length === 0) {
            return res.status(400).send({
                success: false,
                message: "Invalid input. Please provide a valid courseId and updates."
            });
        }
        try {
            // Attempt to update the course
            const status = await dao.updateCourse(courseId, courseUpdates);
            if (status.matchedCount === 0) {
                // No document matched the courseId
                return res.status(404).send({
                    success: false,
                    message: "Course not found during update."
                });
            }
            // Update successful
            return res.status(200).send({
                success: true,
                message: "Course updated successfully.",
                status
            });
        } catch (error) {
            // Handle Mongoose or other unexpected errors
            console.error("Error updating course:", error);
            return res.status(500).send({
                success: false,
                message: "Internal server error during course update.",
                error: error.message
            });
        }
    });

    // Get Modules for a course
    app.get("/api/courses/:courseId/modules", async (req, res) => {
        const { courseId } = req.params;
        const modules = await modulesDao.findModulesForCourse(courseId);
        res.json(modules);
    });

    // Create a module for a course
    app.post("/api/courses/:courseId/modules", async (req, res) => {
        const { courseId } = req.params;
        try {
            // Validate request parameters
            if (!courseId) {
                return res.status(400).send({ error: "Course ID is required when creating a module for course." });
            }
            // Validate request body
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).send({ error: "Module data is required in the request body when creating a module for course." });
            }
            const module = {
                ...req.body,
                course: courseId,
            };
            // Attempt to create a new module
            const newModule = await modulesDao.createModule(module);
            // Check if module creation was successful
            if (!newModule) {
                return res.status(500).send({ error: "Failed to create the module. Please try again." });
            }
            res.status(201).send(newModule); // Use 201 status code for resource creation
        } catch (error) {
            console.error("Error creating module:", error);
            // Handle specific known errors (e.g., validation, database errors)
            if (error.name === "ValidationError") {
                return res.status(400).send({ error: error.message });
            }
            // Generic server error
            res.status(500).send({ error: "An internal server error occurred." });
        }
    });


    // get assignments for a course
    app.get("/api/courses/:courseId/assignments", async (req, res) => {
        try {
            const { courseId } = req.params;
            // Validate courseId
            if (!courseId || typeof courseId !== "string") {
                return res.status(400).json({ error: "Invalid or missing courseId when retrieving assignments." });
            }
            // Retrieve assignments for the course
            const assignments = await assignmentsDao.findAssignmentsForCourse(courseId);
            // Check if assignments exist
            if (!assignments || assignments.length === 0) {
                return res.status(404).json({ error: "No assignments found for the specified course." });
            }
            // Return assignments
            res.status(200).json(assignments);
        } catch (error) {
            console.error("Error retrieving assignments:", error.message);
            res.status(500).json({ error: "An internal server error occurred. Please try again later." });
        }
    });

    // create a new assignment for course
    app.post("/api/courses/:courseId/assignments", async (req, res) => {
        try {
            const { courseId } = req.params; // Extract courseId from the route
            const assignmentData = req.body; // Get assignment data from the request body

            // Validate the courseId and assignmentData
            if (!courseId || typeof courseId !== "string") {
                return res.status(400).json({ error: "Invalid or missing courseId when creating assignment." });
            }
            if (!assignmentData || !assignmentData.title) { // Example validation
                return res.status(400).json({ error: "Invalid or missing assignment data." });
            }
            // Add the courseId to the assignment data
            assignmentData.course = courseId;
            // Create the assignment using the DAO function
            const newAssignment = await assignmentsDao.createAssignment(assignmentData);
            // Respond with the created assignment
            res.status(201).json(newAssignment);
        } catch (error) {
            console.error("Error creating assignment:", error.message);
            res.status(500).json({ error: "An internal server error occurred. Please try again later." });
        }
    });


    // Create a new quiz for a course
    app.post("/api/courses/:courseId/quizzes", async (req, res) => {
        const { courseId } = req.params;
        const quizData = req.body;

        try {

            const course = await dao.findCourseById(courseId);
            if (!course) {
                return res.status(404).send({ error: "Course not found" });
            }

            //  pass the `courseId` to the data
            const quizToCreate = { ...quizData, course: courseId };

            // create a new quiz using the quizzesDao
            const newQuiz = await quizzesDao.createQuiz(quizToCreate);

            // return the new quiz
            res.status(201).send(newQuiz);
        } catch (error) {
            console.error("Error creating quiz:", error);

            // Handle specific known errors
            if (error.name === "ValidationError") {
                return res.status(400).send({ error: "Invalid quiz data when adding new quiz", details: error.errors });
            }

            res.status(500).send({ error: "Failed to create new quiz" });
        }
    });

    // Get all quizzes for a course
    app.get("/api/courses/:courseId/quizzes", async (req, res) => {
        const { courseId } = req.params;

        // Validate courseId
        if (!courseId || typeof courseId !== "string") {
            return res.status(400).send({ error: "Invalid or missing courseId when retrieving quizzes." });
        }

        try {
            // Fetch quizzes for the specified course
            const quizzes = await quizzesDao.findQuizzesByCourse(courseId);
            res.status(200).send(quizzes);
        } catch (error) {
            console.error("Error fetching quizzes for course:", error);
            res.status(500).send({ error: "Failed to fetch quizzes for the course" });
        }
    });

}
