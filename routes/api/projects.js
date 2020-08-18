const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const roleAuth = require("../../middleware/roleAuth");

const User = require("../../models/User");
const Project = require("../../models/Project");
const Ticket = require("../../models/Ticket");

// @route   GET api/projects
// @desc    Get all projects you are attatched to
// @access   Private

router.get("/", [auth, roleAuth("readOwn", "Project")], async (req, res) => {
  try {
    //Might want to populate
    const projects = await Project.find({
      $or: [{ "owner.user": req.user.id }, { "users.user": req.user.id }]
    });

    if (!projects) {
      return res.status(400).json({ msg: "No projects found" });
    }

    res.json(projects);
  } catch (err) {
    console.error(err.msg);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/projects/:id
// @desc    Get a specific project
// @access   Private

router.get("/:id", [auth, roleAuth("readOwn", "Project")], async (req, res) => {
  try {
    //Might want to populate
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(400).json({ msg: "Project not found" });
    }

    if (
      project.owner.user.toString() !== req.user.id &&
      project.users.filter(
        searchUser => searchUser.user.toString() === req.user.id
      ).length === 0
    ) {
      return res
        .status(404)
        .json({ msg: "You do not have access to edit this project" });
    }

    res.json(project);
  } catch (err) {
    console.error(err.msg);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/projects
// @desc    create a project
// @access   Private

router.post(
  "/",
  [
    auth,
    roleAuth("createOwn", "Project"),
    check("title", "Project title is required")
      .not()
      .isEmpty(),
    check("description", "Project description is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    //Check if there are any errors from new project form
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const owner = await User.findById(req.user.id).select("-password");

      const newOwner = {
        user: req.user.id,
        name: owner.name,
        email: owner.email,
        role: owner.role
      };
      const newProject = new Project({
        owner: newOwner,
        title: req.body.title,
        description: req.body.description
      });

      const project = await newProject.save();

      res.json(project);
    } catch (err) {
      console.error(err.msg);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/projects/:id
// @desc    Update a project
// @access   Private

router.put(
  "/:id",
  [auth, roleAuth("updateOwn", "Project")],
  async (req, res) => {
    try {
      const update = req.body;
      const projectId = req.params.id;
      await Project.findByIdAndUpdate(projectId, update);
      const project = await Project.findById(projectId);
      res.json(project);
    } catch (err) {
      console.error(err.msg);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access   Private
router.delete(
  "/:id",
  [auth, roleAuth("deleteOwn", "Project")],
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({ msg: "Project not found" });
      }

      // Check on if owner is deleting project
      if (project.owner.user.toString() !== req.user.id) {
        return res.status(404).json({ msg: "User not authorise" });
      }
      await Ticket.deleteMany({ project: req.params.id });
      await Project.deleteOne({ _id: req.params.id });

      res.json({ msg: "Project removed" });
    } catch (err) {
      console.error(err.msg);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Project not found" });
      }
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
