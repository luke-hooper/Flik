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

    if (!project) {
      return res.status(400).json({ msg: "No projects not found" });
    }

    res.json(projects);
  } catch (err) {
    console.error(err.msg);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/projects/:id
// @desc    Get all projects you are attatched to
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

// @route   GET api/projects/:id/tickets
// @desc    Get all tickets that are attatched to for a specific project
// @access   Private

router.get(
  "/:id/tickets",
  [auth, roleAuth("readOwn", "Ticket")],
  async (req, res) => {
    try {
      //Check if user requesting has access to this project.
      const project = await Project.findById(req.params.id);
      if (
        project.owner.user.toString() !== req.user.id &&
        project.users.filter(
          searchUser => searchUser.user.toString() === req.user.id
        ).length === 0
      ) {
        return res
          .status(404)
          .json({ msg: "You do not have access to view this project" });
      }
      //Might want to populate
      const tickets = await Ticket.find({
        $and: [
          { project: req.params.id },
          {
            $or: [{ "owner.user": req.user.id }, { "users.user": req.user.id }]
          }
        ]
      });

      if (tickets.length === 0) {
        return res.status(400).json({ msg: "No tickets found" });
      }

      res.json(tickets);
    } catch (err) {
      console.error(err.msg);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/projects/:id/tickets/:id_ticket
// @desc    Get a specific ticket on a specific project
// @access   Private

router.get(
  "/:id/tickets/:id_ticket",
  [auth, roleAuth("readOwn", "Ticket")],
  async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id_ticket);

      if (
        ticket.owner.user.toString() !== req.user.id &&
        ticket.users.filter(
          searchUser => searchUser.user.toString() === req.user.id
        ).length === 0
      ) {
        return res
          .status(404)
          .json({ msg: "You do not have access to view this ticket" });
      }

      if (ticket.length === 0) {
        return res.status(400).json({ msg: "No tickets found" });
      }

      res.json(ticket);
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
      const owner = await User.findById(req.user.id).select("-password");

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
      console.log(owner);

      //find user and then initialise users object in ticketfields object
      const user = await User.findOne({ email: email }).select("-password");
      console.log(user);

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
      console.log(project);

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
        project.users.push(ticketFields.users);
      }
      console.log(">>");
      console.log(ticketFields);
      //Create and save the new ticket and save the updated project too
      const newTicket = new Ticket(ticketFields);
      console.log(newTicket);

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

// @route   DELETE api/projects/:id/ticket/:id_ticket
// @desc    Delete a ticket
// @access   Private
router.delete(
  "/:id/ticket/:id_ticket",
  [auth, roleAuth("deleteOwn", "Ticket")],
  async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id_ticket);

      if (!ticket) {
        return res.status(404).json({ msg: "Ticket not found" });
      }

      // Check on if owner is deleting ticket
      if (ticket.owner.user.toString() !== req.user.id) {
        return res.status(404).json({ msg: "User not authorise" });
      }
      await Ticket.deleteOne({ _id: req.params.id_ticket });

      res.json({ msg: "Ticket removed" });
    } catch (err) {
      console.error(err.msg);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Ticket not found" });
      }
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
