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

// @route   POST api/project/:id/ticket
// @desc    create a ticket for a project
// @access   Private

router.post(
  "/:id/ticket",
  [
    auth,
    roleAuth("createOwn", "Ticket"),
    check("title", "Ticket title is required")
      .not()
      .isEmpty(),
    check("description", "Ticket description is required")
      .not()
      .isEmpty(),
    check("priority", "Please provide a piority for this ticket")
      .not()
      .isEmpty(),
    check(
      "email",
      "Please provide an email for whom you wish to give this ticket to."
    )
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    //Check if there are any errors from new project form
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //destructuring / get everything out of the body

    const {
      title,
      description,
      email,
      priority,
      type,
      comments,
      status
    } = req.body;

    //Initialise the ticket field object
    const ticketFields = {};
    if (title) ticketFields.title = title;
    if (description) ticketFields.description = description;
    if (priority) ticketFields.priority = priority;
    if (type) ticketFields.type = type;
    if (comments) ticketFields.comments = comments;
    if (status) ticketFields.status = status;

    try {
      const owner = await User.findById(req.user.id);

      if (!owner) {
        return res.status(404).json({ msg: "Owner does not exist" });
      }
      //initialise the owner object in the ticketfields object
      ticketFields.owner = {
        name: owner.name,
        email: owner.email,
        role: owner.role,
        user: owner._id
      };

      //find user and then initialise users object in ticketfields object
      const user = await User.findOne({ email: email }).select("-password");

      if (!user) {
        return res.status(404).json({ msg: "User does not exist" });
      }
      ticketFields.users = {
        user: user.id,
        name: user.name,
        email,
        role: user.role
      };

      //Find project that the ticket is for
      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({ msg: "Project does not exist" });
      }
      //initilise the project id in ticket fields object
      ticketFields.project = project._id;

      //Check the projects user array and add the user of the new ticket if they are not already in the array
      const projectUser = project.users.find(
        user => user.user.toString() === user.user.toString()
      );

      if (!projectUser) {
        project.users.push(newUser);
      }

      //Create and save the new ticket and save the updated project too
      const newTicket = new Ticket(ticketFields);

      const ticket = await newTicket.save();
      await project.save();
      res.json(ticket);
    } catch (err) {
      console.error(err.msg);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/projects/:id/ticket/:id_ticket
// @desc    Update a ticket
// @access   Private

router.put(
  "/:id/ticket/:id_ticket",
  [auth, roleAuth("updateOwn", "Ticket")],
  async (req, res) => {
    try {
      const ticketId = req.params.id_ticket;
      const ticket = await Ticket.findById(ticketId);
      const update = req.body;
      if (!ticket) {
        return res.status(404).json({ msg: "Ticket does not exist" });
      }

      if (
        ticket.owner.user.toString() !== req.user.id &&
        ticket.users.filter(
          searchUser => searchUser.user.toString() === req.user.id
        ).length === 0
      ) {
        return res
          .status(404)
          .json({ msg: "You do not have access to edit this ticket" });
      }

      await Ticket.findByIdAndUpdate(ticketId, update);
      const newTicket = await Ticket.findById(ticketId);
      res.json(newTicket);
    } catch (err) {
      console.error(err.msg);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
