import * as modulesDao from "./dao.js";
export default function ModuleRoutes(app) {

    // Delete a Module by module id
    app.delete("/api/modules/:moduleId", async (req, res) => {
        const { moduleId } = req.params;
        try {
            // Validate the module ID
            if (!moduleId) {
                return res.status(400).send({ error: "Module ID is required for deletion." });
            }
            // Attempt to delete the module
            const status = await modulesDao.deleteModule(moduleId);
            // Check if the module was successfully deleted
            if (!status || status.deletedCount === 0) {
                return res.status(404).send({ error: "Module not found or already deleted." });
            }
            // successful deletetion
            res.status(200).send({ message: "Module deleted successfully.", status });
        } catch (error) {
            console.error("Error deleting module:", error);
            // Generic server error
            res.status(500).send({ error: "An internal server error occurred during module deletion." });
        }
    });

    // Update a Module by ID
    app.put("/api/modules/:moduleId", async (req, res) => {
        const { moduleId } = req.params;
        const moduleUpdates = req.body;
        try {
            // Validate the module ID
            if (!moduleId) {
                return res.status(400).send({ error: "Module ID is required during UPDATE." });
            }
            // Validate the request body
            if (!moduleUpdates || Object.keys(moduleUpdates).length === 0) {
                return res.status(400).send({ error: "Module updates are required in the request body." });
            }
            // Attempt to update the module
            const status = await modulesDao.updateModule(moduleId, moduleUpdates);
            // Check if the update was successful
            if (!status || status.matchedCount === 0) {
                return res.status(404).send({ error: "Module not found or update failed." });
            }
            // Successful Update
            res.status(200).send({ message: "Module updated successfully.", status });
        } catch (error) {
            console.error("Error updating module:", error);
            // Generic server error
            res.status(500).send({ error: "An internal server error occurred during UPDATE." });
        }
    });

}
