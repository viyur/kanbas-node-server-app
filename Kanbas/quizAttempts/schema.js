import mongoose from "mongoose";
import * as questionDao from "../Questions/dao.js";
const quizAttemptSchema = new mongoose.Schema(
    {
        // Reference to the quiz being attempted
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: "QuizModel", required: true },

        // Reference to the user (faculty in this case) taking the quiz
        user: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },

        // Array of question responses
        responses: [
            {
                question: { type: mongoose.Schema.Types.ObjectId, ref: "QuestionModel", required: true },
                answer: mongoose.Schema.Types.Mixed, // Store the answer in a flexible format
                isCorrect: { type: Boolean }, // Store whether the answer was correct (optional, for scoring)
            },
        ],

        // Quiz score
        score: { type: Number, default: 0 },

        // Metadata
        attemptedAt: { type: Date, default: Date.now },
        startedAt: { type: Date },
    },
    { timestamps: true, collection: "quizAttempts" }
);

// Pre-save middleware to calculate score
quizAttemptSchema.pre("save", async function (next) {
    if (!this.responses || this.responses.length === 0) {
        this.score = 0; // No responses, score is 0
        return next();
    }

    try {
        let totalScore = 0;

        // Iterate through responses and calculate the score
        for (const response of this.responses) {
            if (response.isCorrect) {
                // Find the question to get its points value
                const question = await questionDao.findQuestionById(response.question);
                if (question) {
                    totalScore += question.points;
                }
            }
        }

        this.score = totalScore;
        next();
    } catch (error) {
        next(error); // Pass error to Mongoose for proper handling
    }
});
export default quizAttemptSchema;