// DEPENDENCIES
const router = require("express").Router();
const Project = require("../../models/Project");
const { authMiddleware } = require("../../utils/auth");

// All project routes require authentication
router.use(authMiddleware);

// CREATE - POST /api/projects
router.post("/", async (req, res) => {
    try {
        const project = await Project.create({
            ...req.body,
            user: req.user._id,
        });
        res.status(201).json(project);
    } catch (err) {
        console.error("Error creating project: ", err);
        res.status(400).json({ message: err.message });
    }
});

// READ ALL - GET /api/projects (own only)
router.get("/", async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id });
        res.json(projects);
    } catch (err) {
        console.error("Error fetching projects: ", err);
        res.status(500).json({ message: err.message });
    }
});

// READ ONE - GET /api/projects/:id (owner only)
router.get("/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "No project found with this id!" });
        }

        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "User is not authorized to view this project." });
        }

        res.json(project);
    } catch (err) {
        console.error("Error fetching project: ", err);
        res.status(500).json({ message: err.message });
    }
});

// UPDATE - PUT /api/projects/:id (owner only)
router.put("/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "No project found with this id!" });
        }

        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "User is not authorized to update this project." });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedProject);
    } catch (err) {
        console.error("Error updating project: ", err);
        res.status(500).json({ message: err.message });
    }
});

// DELETE - DELETE /api/projects/:id (owner only)
router.delete("/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "No project found with this id!" });
        }

        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "User is not authorized to delete this project." });
        }

        await Project.findByIdAndDelete(req.params.id);

        res.json({ message: "Project deleted!" });
    } catch (err) {
        console.error("Error deleting project: ", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;