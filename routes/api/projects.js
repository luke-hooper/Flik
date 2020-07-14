const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const roleAuth = require("../../middleware/roleAuth");

const User = require("../../models/User");
const Project = require("../../models/Project");

// @route   GET api/projects
// @desc    Get all projects you are attatched to
// @access   Private

router.get("/", [auth, roleAuth("readOwn", "Project")], async (req, res) => {});

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

module.exports = router;
