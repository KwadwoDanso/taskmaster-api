// DEPENDENCIES
const router = require("express").Router();
const Task = require("../../models/Task");
const Project = require("../../models/Project");
const { authMiddleware } = require("../../utils/auth");

// All task routes require authentication
router.use(authMiddleware);

// CREATE - POST /api/projects/:projectId/tasks
// Must verify user owns the parent project
router.post("/projects/:projectId/tasks", async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ message: "No project found with this id!" });
        }

        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "User is not authorized to add tasks to this project." });
        }

        const task = await Task.create({
            ...req.body,
            project: req.params.projectId,
        });

        res.status(201).json(task);
    } catch (err) {
        console.error("Error creating task: ", err);
        res.status(400).json({ message: err.message });
    }
});

// READ ALL - GET /api/projects/:projectId/tasks
// Must verify user owns the parent project
router.get("/projects/:projectId/tasks", async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ message: "No project found with this id!" });
        }

        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "User is not authorized to view tasks in this project." });
        }

        const tasks = await Task.find({ project: req.params.projectId });
        res.json(tasks);
    } catch (err) {
        console.error("Error fetching tasks: ", err);
        res.status(500).json({ message: err.message });
    }
});

// UPDATE - PUT /api/tasks/:taskId
// Must find task → find parent project → verify ownership
router.put("/tasks/:taskId", async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: "No task found with this id!" });
        }

        // Find the parent project to check ownership
        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({ message: "Parent project not found!" });
        }

        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "User is not authorized to update this task." });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.taskId,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedTask);
    } catch (err) {
        console.error("Error updating task: ", err);
        res.status(500).json({ message: err.message });
    }
});

// DELETE - DELETE /api/tasks/:taskId
// Must find task → find parent project → verify ownership
router.delete("/tasks/:taskId", async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: "No task found with this id!" });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({ message: "Parent project not found!" });
        }

        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "User is not authorized to delete this task." });
        }

        await Task.findByIdAndDelete(req.params.taskId);

        res.json({ message: "Task deleted!" });
    } catch (err) {
        console.error("Error deleting task: ", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;