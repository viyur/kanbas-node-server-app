import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
    {
        // Reference to the course this assignment belongs to
        course: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel", required: true },

        // Title of the assignment
        title: { type: String, required: true },

        // Description of the assignment
        description: { type: String },

        // Due date
        dueDate: { type: Date },

        // Available from date
        availableFromDate: { type: Date },

        // Available until date
        availableUntilDate: { type: Date },

        // Total points for the assignment
        points: { type: Number }
    },
    { collection: "assignments" } // Automatically add createdAt and updatedAt fields
);

export default assignmentSchema;
