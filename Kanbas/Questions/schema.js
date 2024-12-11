import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        // Reference to the quiz this question belongs to
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: "QuizModel", required: true },

        // Title of the question
        title: { type: String, default: "Default new question title", required: true },

        // Points assigned to the question
        points: { type: Number, default: 0 },

        // Question text (supports WYSIWYG)
        question: { type: String, default: "" },

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

        },

        // Answers for Fill in the blank questions
        blankAnswers: {
            type: [
                {
                    text: { type: String, default: "", required: true }, // Possible correct answer
                    caseInsensitive: { type: Boolean, default: true }, // Indicates if the answer is case-insensitive
                },
            ], default: []
        },

        // Answer for True/false questions
        trueFalseAnswer: { type: Boolean, default: false }, // True or False value
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
        collection: "questions", // Name of the MongoDB collection
        toJSON: { virtuals: true }, // Include virtuals when converting to JSON
        toObject: { virtuals: true }, // Include virtuals when converting to a plain object
    }
);

questionSchema.virtual("correctAnswer").get(function () {
    switch (this.questionType) {
        case "Multiple Choice":
            return (this.choices || [])
                .filter((choice) => choice.isCorrect)
                .map((choice) => choice.text);
        case "Fill in the blank":
            return (this.blankAnswers || []).map((answer) => answer.text);
        case "True/false":
            return this.trueFalseAnswer;
        default:
            return [];
    }
});


export default questionSchema;
