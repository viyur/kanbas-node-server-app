import QuestionModel from "./model.js";

// find all questions according to a quiz id
export async function findQuestionsByQuiz(quizId) {
    return await QuestionModel.find({ quiz: quizId });
}

// find question by id
export async function findQuestionById(questionId) {
    return await QuestionModel.findOne({ _id: questionId });
}

// create a new question
export async function createQuestion(question) {
    delete question._id;
    return await QuestionModel.create(question);
}

// delete a question
export async function deleteQuestion(questionId) {
    return await QuestionModel.deleteOne({ _id: questionId });
}

// update a question
export async function updateQuestion(questionId, questionUpdates) {
    return await QuestionModel.findByIdAndUpdate(questionId, questionUpdates, { new: true });
}

