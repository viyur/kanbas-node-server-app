import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";


//let currentUser = null; // single source of truth, final say of who is current user
export default function UserRoutes(app) {
    const createUser = async (req, res) => {
        const user = await dao.createUser(req.body);
        res.json(user);
    };

    const deleteUser = async (req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);
    };
    const findUserById = async (req, res) => {
        const user = await dao.findUserById(req.params.userId);
        res.json(user);
    };

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



    const findCoursesForEnrolledUser = (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = courseDao.findCoursesForEnrolledUser(userId);
        res.json(courses);
    };


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



    const signout = (req, res) => {
        req.session.destroy();

        res.sendStatus(200);
    };


    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };

    const createCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        const newCourse = courseDao.createCourse(req.body); // create a course
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id); // then enroll
        res.json(newCourse);
    };


    const findEnrollmentsForUser = (req, res) => {
        const { userId: paramUserId } = req.params;

        // Resolve userId from session if "current" is specified
        let userId = paramUserId;
        if (paramUserId === "current") {
            const currentUser = req.session?.currentUser;
            if (!currentUser) {
                console.error("Unauthorized: No user is logged in");
                return res.status(401).json({ error: "Unauthorized: Please log in" });
            }
            userId = currentUser._id; // Set userId to the logged-in user's ID
        }

        // Validate userId
        if (!userId) {
            console.error("Bad Request: Missing userId in request params or session");
            return res.status(400).json({ error: "Bad Request: User ID is required" });
        }

        try {
            console.log("Fetching enrollments for user:", userId);
            const enrollments = enrollmentsDao.findEnrollmentsForUser(userId);

            if (!enrollments || enrollments.length === 0) {
                console.warn(`No enrollments found for user ID: ${userId}`);
                return res.status(404).json({ message: "No enrollments found" });
            }

            console.log(`Found ${enrollments.length} enrollments for user ID: ${userId}`);
            return res.json(enrollments);
        } catch (error) {
            console.error("Failed to retrieve enrollments:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
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



    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile); // to constantly tell the front end who is logged in
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.post("/api/users/current/courses", createCourse);
    app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);
    app.post("/api/users/:userId/enrollments", addEnrollmentForUser);
    app.delete("/api/users/:userId/enrollments/:courseId", deleteEnrollmentForUser);
}

