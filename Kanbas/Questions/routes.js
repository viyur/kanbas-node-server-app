import * as questionDao from "./dao.js";
export default function questionRoutes(app) {
    // find question by id route
    app.get("/api/questions/:questionId", async (req, res) => {
        const { questionId } = req.params;
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
}
