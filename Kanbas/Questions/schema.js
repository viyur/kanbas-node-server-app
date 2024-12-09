import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        // Reference to the quiz this question belongs to
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: "QuizModel", required: true },

        // Title of the question
        title: { type: String, default: "Default new question title", required: true },

        // Points assigned to the question
        points: { type: Number, default: 0, required: true },

        // Question text (supports WYSIWYG)
        question: { type: String, default: "", required: true },

        // Type of the question
        questionType: {
            type: String,
            enum: ["Multiple Choice", "True/false", "Fill in the blank"],
            default: "Multiple Choice",
            required: true,
        },

        // Choices for Multiple choice questions
        choices: {
            type: [
                {
                    text: { type: String, default: "", required: true }, // Choice text
                    isCorrect: { type: Boolean, required: true, default: false }, // Indicates if this is the correct choice
                },
            ],
            default: [],
            required: true,
        },

        // Answers for Fill in the blank questions
        blankAnswers: {
            type: [
                {
                    text: { type: String, default: "", required: true }, // Possible correct answer
                    caseInsensitive: { type: Boolean, required: true, default: true }, // Indicates if the answer is case-insensitive
                },
            ], default: [], required: true
        },

        // Answer for True/false questions
        trueFalseAnswer: { type: Boolean, default: false, required: true }, // True or False value
    },
    { timestamps: true, collection: "questions" }
);

export default questionSchema;
