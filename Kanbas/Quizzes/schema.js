import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
    {
        // Reference to the course this quiz belongs to
        course: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel", required: true },


        // Title of the quiz
        title: { type: String, required: true },

        // Description of the quiz (supports rich text)
        description: { type: String },

        // Quiz type with default value
        quizType: {
            type: String,
            enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
            default: "Graded Quiz",
        },

        // Total points for the quiz
        points: { type: Number, default: 100 },

        // Assignment group with default value
        assignmentGroup: {
            type: String,
            enum: ["Quizzes", "Exams", "Assignments", "Project"],
            default: "Quizzes",
        },

        // Shuffle answers
        shuffleAnswers: { type: Boolean, default: true },

        // Time limit in minutes (default 20 minutes)
        timeLimit: { type: Number, default: 20 },

        // Multiple attempts allowed
        multipleAttempts: { type: Boolean, default: false },

        // Number of attempts (only relevant if multipleAttempts is true)
        howManyAttempts: { type: Number, default: 1 },

        // Show correct answers (rules for when answers are shown)
        showCorrectAnswers: { type: String, default: "None" },

        // Access code for the quiz
        accessCode: { type: String, default: "" },

        // Display one question at a time
        oneQuestionAtATime: { type: Boolean, default: true },

        // Webcam required for the quiz
        webcamRequired: { type: Boolean, default: false },

        // Lock questions after answering
        lockQuestionsAfterAnswering: { type: Boolean, default: false },

        // Due date
        dueDate: { type: Date },

        // Available date
        availableDate: { type: Date },

        // Until date
        untilDate: { type: Date },

        // Assigned to (default is Everyone)
        assignedTo: { type: String, default: "Everyone" },

        // Unpublished by default
        published: { type: Boolean, default: false },
    },
    { collection: "quizzes" }
);

export default quizSchema;
