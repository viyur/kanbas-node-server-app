import * as questionDao from "./dao.js";
export default function questionRoutes(app) {
    // find question by id route
    app.get("/api/questions/:questionId", async (req, res) => {
        const { questionId } = req.params;
        if (!questionId) {
            return res.status(400).send({ error: "Question ID is required" });
        }
        try {
            const question = await questionDao.findQuestionById(questionId);
            if (!question) {
                return res.status(404).send({ error: "Question not found" });
            }
            res.status(200).send(question);
        } catch (error) {
            console.error("Error fetching question by ID:", error);
            res.status(500).send({ error: "Failed to fetch question" });
        }
    });

    // update a question by id route
    app.put("/api/questions/:questionId", async (req, res) => {
        const { questionId } = req.params;
        const questionUpdates = req.body;
        if (!questionId) {
            return res.status(400).send({ error: "Question ID is required" });
        }
        try {
            const updatedQuestion = await questionDao.updateQuestion(questionId, questionUpdates);
            if (!updatedQuestion) {
                return res.status(404).send({ error: "Question not found" });
            }
            res.status(200).send(updatedQuestion);
        } catch (error) {
            console.error("Error updating question:", error);
            res.status(500).send({ error: "Failed to update question" });
        }
    });

    // delete a question by id route
    app.delete("/api/questions/:questionId", async (req, res) => {
        const { questionId } = req.params;
        if (!questionId) {
            return res.status(400).send({ error: "Question ID is required" });
        }
        try {
            const result = await questionDao.deleteQuestion(questionId);
            if (result.deletedCount === 0) {
                return res.status(404).send({ error: "Question not found" });
            }
            res.status(200).send({ message: "Question deleted successfully" });
        } catch (error) {
            console.error("Error deleting question:", error);
            res.status(500).send({ error: "Failed to delete question" });
        }
    });
}
