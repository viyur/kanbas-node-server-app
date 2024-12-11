import quizAttemptSchema from "./schema.js";
import mongoose from "mongoose";

const model = mongoose.model("QuizAttemptModel", quizAttemptSchema);
export default model;