import * as quizAttemptDao from "./dao.js";
export default function quizAttemptRoutes(app) {
    // Create a new quiz attempt
    app.post("/api/quiz-attempts", async (req, res) => {
        const { quiz, user, responses, attemptedAt, startedAt } = req.body; // Extract from the request body

        // Validate required fields
        if (!quiz || !user || !responses || !attemptedAt) {
            return res.status(400).send({
                error: "Quiz ID, user ID (in query), and responses (in body) are required.",
            });
        }

        try {
            const newAttempt = {
                quiz,
                user,
                responses,
                attemptedAt,
                startedAt,
            };

            // Create the quiz attempt
            const createdAttempt = await quizAttemptDao.createNewQuizAttempt(newAttempt);

            res.status(201).send({
                message: "Quiz attempt created successfully",
                attempt: createdAttempt,
            });
        } catch (error) {
            console.error("Error creating quiz attempt:", error);
            res.status(500).send({ error: "Failed to create quiz attempt" });
        }
    });


    // Fetch all quiz attempts by quiz and user
    app.get("/api/quiz-attempts", async (req, res) => {
        const { quiz, user } = req.query; // Extract from query parameters

        // Validate required fields
        if (!quiz || !user) {
            return res.status(400).send({
                error: "Quiz ID and User ID are required as query parameters.",
            });
        }
        try {
            // Retrieve all quiz attempts for the given quiz and user
            const attempts = await quizAttemptDao.findQuizAttemptsByQuizAndUser(quiz, user);

            res.status(200).send({
                message: "Quiz attempts retrieved successfully",
                attempts,
            });
        } catch (error) {
            console.error("Error fetching quiz attempts:", error);
            res.status(500).send({ error: "Failed to fetch quiz attempts" });
        }
    });

    // Fetch the latest quiz attempt by quiz and user
    app.get("/api/quiz-attempts/latest", async (req, res) => {
        const { quiz, user } = req.query; // Extract from query parameters

        // Validate required fields
        if (!quiz || !user) {
            return res.status(400).send({
                error: "Quiz ID and User ID are required as query parameters.",
            });
        }

        try {
            // Retrieve the latest quiz attempt for the given quiz and user
            const latestAttempt = await quizAttemptDao.findLatestQuizAttempt(user, quiz);

            if (!latestAttempt) {
                return res.status(404).send({ error: "No quiz attempts found for the specified quiz and user." });
            }

            res.status(200).send({
                message: "Latest quiz attempt retrieved successfully",
                attempt: latestAttempt,
            });
        } catch (error) {
            console.error("Error fetching the latest quiz attempt:", error);
            res.status(500).send({ error: "Failed to fetch the latest quiz attempt" });
        }
    });

}


