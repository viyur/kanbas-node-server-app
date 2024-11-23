import assignments from "../Database/assignments.js";
import * as assignmentsDao from "./dao.js";
export default function AssignmentRoutes(app) {
    app.delete("/api/assignments/:assignmentId", (req, res) => {
        const { assignmentId } = req.params;
        const status = assignmentsDao.deleteAssignment(assignmentId);
        res.send(status);
    });

    app.put("/api/assignments/:assignmentId", (req, res) => {
        const { assignmentId } = req.params;
        const assignmentUpdates = req.body;
        const status = assignmentsDao.updateAssignment(assignmentId, assignmentUpdates);
        res.send(status);
    });



}
