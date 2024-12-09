import express from 'express';
import mongoose from "mongoose";
import session from "express-session";
import "dotenv/config";
import cors from "cors";
// routes import
import Hello from './Hello.js';
import Lab5 from './Lab5/index.js';
import PathParameters from './Lab5/PathParameters.js';
import QueryParameters from './Lab5/QueryParameters.js';
import WorkingWithObjects from './Lab5/WorkingWithObjects.js';
import WorkingWithArrays from './Lab5/WorkingWithArrays.js';
import UserRoutes from "./Kanbas/Users/routes.js";
import CourseRoutes from "./Kanbas/Courses/routes.js";
import ModuleRoutes from "./Kanbas/Modules/routes.js";
import AssignmentRoutes from './Kanbas/Assignments/routes.js';
import QuizRoutes from './Kanbas/Quizzes/routes.js';
import questionRoutes from './Kanbas/Questions/routes.js';

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kanbas-cs5610-fa2024";
mongoose.connect(CONNECTION_STRING);

const app = express();
// CORS
app.use(
    cors({
        credentials: true,
        origin: process.env.NETLIFY_URL || "http://localhost:3000",
    })
);

// Session Options
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kanbas",
    resave: false,
    saveUninitialized: false
};

// Production Mode Setting
if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        domain: process.env.NODE_SERVER_DOMAIN,
    };
}
app.use(express.json());
app.use(
    session(sessionOptions)
);




// Lab routes
Hello(app);
Lab5(app);
PathParameters(app);
QueryParameters(app);
WorkingWithObjects(app);
WorkingWithArrays(app);

// Kanbas
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
QuizRoutes(app);
questionRoutes(app);

app.listen(process.env.PORT || 4000);