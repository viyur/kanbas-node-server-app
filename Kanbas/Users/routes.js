import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";


//let currentUser = null; // single source of truth, final say of who is current user
export default function UserRoutes(app) {

    // About Login/Logout
    // user Sign Up
    const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({ message: "Username already taken" });
            return;
        }
        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    // Sign In
    const signin = async (req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.status(401).json({ message: "Unable to login. Try again later." });
        }
    };

    // Sign Out
    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };

    // See the profile of Current User
    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };

    // About Users table for ADMIN
    // Create a new user
    const createUser = async (req, res) => {
        const user = await dao.createUser(req.body);
        res.json(user);
    };

    // Delete a user
    const deleteUser = async (req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);
    };

    // Find a user by ID
    const findUserById = async (req, res) => {
        const user = await dao.findUserById(req.params.userId);
        res.json(user);
    };

    // Find all users
    const findAllUsers = async (req, res) => {
        const { role, name } = req.query;
        if (role) {
            const users = await dao.findUsersByRole(role); //return array of users
            res.json(users);
            return;
        }
        if (name) {
            const users = await dao.findUsersByPartialName(name);
            res.json(users);
            return;
        }
        const users = await dao.findAllUsers();
        res.json(users);
    };

    // Update a user
    const updateUser = async (req, res) => {
        const { userId } = req.params;
        const userUpdates = req.body;
        await dao.updateUser(userId, userUpdates);
        const currentUser = req.session["currentUser"];
        if (currentUser && currentUser._id === userId) {
            // update session
            req.session["currentUser"] = { ...currentUser, ...userUpdates };
        }
        res.json(req.session["currentUser"]);
    };

    // About Courses 
    // Find courses user enrolled in
    const findCoursesForUser = async (req, res) => {
        try {
            const currentUser = req.session["currentUser"];
            // Check if the user is authenticated
            if (!currentUser) {
                return res.status(401).send({ error: "Please log in to see your courses" });
            }
            // If the user is an admin, fetch all courses
            if (currentUser.role === "ADMIN") {
                const courses = await courseDao.findAllCourses();
                if (!courses || courses.length === 0) {
                    return res.status(404).send({ error: "No courses found for ADMIN." });
                }
                return res.status(200).json(courses);
            }
            // Extract user ID from params or use the current user ID
            let { uid } = req.params;
            if (uid === "current") {
                uid = currentUser._id;
            }
            // Validate user ID
            if (!uid) {
                return res.status(400).send({ error: "CurrentUser does not have _id when fetching courses for current user." });
            }
            // Fetch courses for the specified user
            const courses = await enrollmentsDao.findCoursesForUser(uid);
            if (!courses || courses.length === 0) {
                return res.status(404).send({ error: "No courses found for this user." });
            }
            // successful retrieving courses for user
            res.status(200).json(courses);
        } catch (error) {
            console.error("Error fetching courses for user:", error);
            // Specific error handling for database or validation errors
            if (error.name === "CastError") {
                return res.status(400).send({ error: "Invalid user ID format." });
            }
            // Generic server error
            res.status(500).send({ error: "An internal server error occurred." });
        }
    };


    const createCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        const newCourse = courseDao.createCourse(req.body); // create a course
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id); // then enroll
        res.json(newCourse);
    };


    const findEnrollmentsForUser = async (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session?.["currentUser"];
            if (!currentUser) {
                console.error("Unauthorized: No current user in session");
                return res.sendStatus(401); // User not logged in
            }
            userId = currentUser._id; // Resolve userId from session
        }
        const enrollments = await enrollmentsDao.findEnrollmentsForUser(userId);
        if (!enrollments || enrollments.length === 0) {
            console.error("No enrollments found for user:", userId);
            return res.status(404).json({ error: "No enrollments found for user" });
        }
        res.json(enrollments);
    };

    const addEnrollmentForUser = (req, res) => {
        let { userId } = req.params;
        // Handle "current" userId case
        if (userId === "current") {
            const currentUser = req.session?.["currentUser"];
            if (!currentUser) {
                console.error("Unauthorized: No current user in session");
                return res.sendStatus(401); // User not logged in
            }
            userId = currentUser._id; // Resolve userId from session
        }

        // Validate the resolved userId
        if (!userId) {
            console.error("Bad Request: Missing userId in session or params");
            return res.status(400).json({ error: "User ID is required for enrollment" });
        }

        const { course } = req.body;

        // Validate the course field
        if (!course) {
            console.error("Bad Request: 'course' field is missing in enrollment request");
            return res.status(400).json({ error: "'course' field is required" });
        }

        console.log("Processing enrollment request:", { userId, course });

        try {
            const newEnrollment = enrollmentsDao.enrollUserInCourse(userId, course);
            console.log("Enrollment successful:", newEnrollment);
            return res.json(newEnrollment); // Respond with the newly created enrollment
        } catch (error) {
            console.error("Failed to process enrollment request:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    const deleteEnrollmentForUser = (req, res) => {
        const { userId, courseId } = req.params;
        if (!userId || !courseId) {
            console.error("Bad Request: Missing userId or courseId");
            return res.status(400).json({ error: "User ID and Course ID are required" });
        }

        try {
            const result = enrollmentsDao.deleteEnrollment(userId, courseId);
            if (result) {
                console.log("Enrollment deleted:", { userId, courseId });
                return res.sendStatus(204); // No Content
            } else {
                console.error("Enrollment not found");
                return res.status(404).json({ error: "Enrollment not found" });
            }
        } catch (error) {
            console.error("Failed to delete enrollment:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };


    // enrollments
    const enrollUserInCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            uid = currentUser._id;
        }
        const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
        res.send(status);
    };
    const unenrollUserFromCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            uid = currentUser._id;
        }
        const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
        res.send(status);
    };




    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile); // to constantly tell the front end who is logged in
    app.get("/api/users/:uid/courses", findCoursesForUser);
    app.post("/api/users/current/courses", createCourse);
    app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);
    // app.post("/api/users/:userId/enrollments", addEnrollmentForUser);
    // app.delete("/api/users/:userId/enrollments/:courseId", deleteEnrollmentForUser);
    app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
    app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);

}

