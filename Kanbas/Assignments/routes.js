import assignments from "../Database/assignments.js";
import * as assignmentsDao from "./dao.js";
export default function AssignmentRoutes(app) {

    // Delete an assignment
    app.delete("/api/assignments/:assignmentId", async (req, res) => {
        try {
            const { assignmentId } = req.params;
            // Validate assignmentId
            if (!assignmentId || typeof assignmentId !== "string") {
                return res.status(400).json({ error: "Invalid or missing assignmentId during deletion." });
            }
            // Delete the assignment
            const status = await assignmentsDao.deleteAssignment(assignmentId);
            // Check if the assignment was successfully deleted
            if (!status || status.deletedCount === 0) {
                return res.status(404).json({ error: "Assignment not found or already deleted." });
            }
            // Respond with success
            res.status(200).json({ message: "Assignment successfully deleted." });
        } catch (error) {
            console.error("Error deleting assignment:", error.message);
            // Handle internal server errors
            res.status(500).json({ error: "An internal server error occurred. Please try again later." });
        }
    });

    // Update an assignment
    app.put("/api/assignments/:assignmentId", async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const assignmentUpdates = req.body;
            // Validate assignmentId
            if (!assignmentId || typeof assignmentId !== "string") {
                return res.status(400).json({ error: "Invalid or missing assignmentId during update." });
            }
            // Validate assignment updates
            if (!assignmentUpdates || Object.keys(assignmentUpdates).length === 0) {
                return res.status(400).json({ error: "No updated assignment data provided." });
            }
            // Update the assignment
            const result = await assignmentsDao.updateAssignment(assignmentId, assignmentUpdates);
            // Check if the update was successful
            if (result.matchedCount === 0) {
                return res.status(404).json({ error: "Assignment not found during update." });
            }
            if (result.modifiedCount === 0) {
                return res.status(200).json({ message: "No changes were made to the assignment." });
            }
            // Respond with success
            res.status(200).json({ message: "Assignment updated successfully." });
        } catch (error) {
            console.error("Error updating assignment:", error.message);
            res.status(500).json({ error: "An internal server error occurred. Please try again later." });
        }
    });



}
