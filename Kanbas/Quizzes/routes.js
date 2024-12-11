import * as quizDao from "./dao.js";
import * as questionDao from "../Questions/dao.js";

export default function quizRoutes(app) {

    // fetch one quiz by quiz id
    app.get("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;

        if (!quizId) {
            return res.status(400).send({ error: "Quiz ID is required when fetching a quiz" });
        }

        try {
            const quiz = await quizDao.findQuizById(quizId);

            if (!quiz) {
                return res.status(404).send({ error: "Quiz not found" });
            }

            res.status(200).send(quiz);
        } catch (error) {
            console.error("Error fetching quiz by ID:", error);
            res.status(500).send({ error: "Failed to fetch quiz" });
        }
    });


    // Update a quiz by its ID
    app.put("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;
        const quizUpdates = req.body;

        if (!quizId) {
            return res.status(400).send({ error: "Quiz ID is required to update a quiz" });
        }

        if (!quizUpdates) {
            return res.status(400).send({ error: "Quiz updates body are required to update a quiz" });
        }

        try {
            const updatedQuiz = await quizDao.updateQuiz(quizId, quizUpdates);

            if (!updatedQuiz) {
                return res.status(404).send({ error: "Quiz not found" });
            }

            res.status(200).send({ message: "Quiz updated successfully", quiz: updatedQuiz });
        } catch (error) {
            console.error("Error updating quiz:", error);
            res.status(500).send({ error: "Failed to update quiz" });
        }
    });


    // Delete a quiz by its ID
    app.delete("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;

        if (!quizId) {
            return res.status(400).send({ error: "Quiz ID is required to delete a quiz." });
        }

        try {
            const result = await quizDao.deleteQuiz(quizId);

            if (result.deletedCount === 0) {
                return res.status(404).send({ error: "Quiz not found." });
            }

            res.status(200).send({ message: "Quiz deleted successfully." });
        } catch (error) {
            console.error("Error deleting quiz:", error);
            res.status(500).send({ error: "Failed to delete quiz." });
        }
    });


    // add a question to a quiz
    app.post("/api/quizzes/:quizId/questions", async (req, res) => {
        const { quizId } = req.params;
        const question = req.body;

        if (!quizId) {
            return res.status(400).send({ error: "Quiz ID is required to add a question to a quiz." });
        }

        if (!question) {
            return res.status(400).send({ error: "Question body is required to add a question to a quiz." });
        }

        // Validate required fields in the question body
        if (!question.title || !question.question) {
            return res.status(400).send({
                error: "Question must include title and question text.",
            });
        }

        try {
            const newQuestion = { ...question, quiz: quizId };
            const addedQuestion = await questionDao.createQuestion(newQuestion);
            res.status(201).send({ message: "Question added to quiz successfully.", question: addedQuestion });
        } catch (error) {
            console.error("Error adding question to quiz:", error);
            res.status(500).send({ error: "Failed to add question to quiz." });
        }
    });


    // find all questions for a quiz
    app.get("/api/quizzes/:quizId/questions", async (req, res) => {
        const { quizId } = req.params;

        if (!quizId) {
            return res.status(400).send({ error: "Quiz ID is required to fetch questions for a quiz." });
        }

        try {
            const questions = await questionDao.findQuestionsByQuiz(quizId);
            res.status(200).send(questions);
        } catch (error) {
            console.error("Error fetching questions for a quiz:", error);
            res.status(500).send({ error: "Failed to fetch questions for a quiz." });
        }
    });
}
