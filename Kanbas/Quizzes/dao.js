import quizModel from "./model.js";

export async function findAllQuizzes() {
    return await quizModel.find();
};

export async function createQuiz(quiz) {
    delete quiz._id;
    return await quizModel.create(quiz);
};

// Find all quizzes belonging to a specific course
export async function findQuizzesByCourse(courseId) {
    return await quizModel.find({ course: courseId });
}

// fetch one quiz by quiz id
export async function findQuizById(quizId) {
    return await quizModel.findOne({ _id: quizId });
}

// update a quiz
export async function updateQuiz(quizId, quizUpdates) {
    return await quizModel.findByIdAndUpdate(quizId, quizUpdates, { new: true });
}

// delete a quiz
export async function deleteQuiz(quizId) {
    return await quizModel.deleteOne({ _id: quizId });
}
