import model from "./model.js";

// create a new quiz attempt
export const createNewQuizAttempt = async (quizAttempt) => {
    delete quizAttempt._id;
    return await model.create(quizAttempt);
};

// retrieve the latest quiz attempt for a given user and quiz
export const findLatestQuizAttempt = async (userId, quizId) => {
    return await model.findOne({ user: userId, quiz: quizId }).sort({ attemptedAt: -1 });
};

// find all quiz attempts by same user who took the same quiz
export async function findQuizAttemptsByQuizAndUser(quizId, userId) {
    return await model.find({ quiz: quizId, user: userId }).sort({ attemptedAt: 1 });
}
