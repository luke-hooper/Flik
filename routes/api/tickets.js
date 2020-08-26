const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const roleAuth = require("../../middleware/roleAuth");

const User = require("../../models/User");
const Project = require("../../models/Project");
const Ticket = require("../../models/Ticket");

// @route   GET api/tickets/
// @desc    Get all tickets you are attatched to
// @access   Private

router.get("/", [auth, roleAuth("readOwn", "Ticket")], async (req, res) => {
  try {
    //Might want to populate
    const tickets = await Ticket.find({
      $or: [{ "owner.user": req.user.id }, { "users.user": req.user.id }]
    });

    if (!tickets) {
      return res.status(400).json({ msg: "User has no tickets" });
    }

    res.json(tickets);
  } catch (err) {
    console.error(err.msg);
    res.status(500).send("Server Error1");
  }
});

// @route   GET api/tickets/project/:id_project
// @desc    Get all tickets that are attatched to for a specific project
// @access   Private

router.get(
  "/project/:id_project",
  [auth, roleAuth("readOwn", "Ticket")],
  async (req, res) => {
    try {
      //Check if user requesting has access to this project.
      const project = await Project.findById(req.params.id_project);
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
          { project: req.params.id_project },
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

// @route   GET api/tickets/:id_ticket
// @desc    Get a specific ticket on a specific project
// @access   Private

router.get(
  "/:id_ticket",
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

// @route   POST api/tickets/project/:id_project
// @desc    create a ticket for a project
// @access   Private

router.post(
  "/project/:id_project",
  [
    auth,
    [
      roleAuth("createOwn", "Ticket"),
      check("title", "Ticket title is required")
        .not()
        .isEmpty(),
      check("description", "Ticket description is required")
        .not()
        .isEmpty(),
      check("priority", "Please provide a priority for this ticket")
        .not()
        .isEmpty(),

      check(
        "email",
        "Please provide an email for whom you wish to give this ticket to."
      )
        .not()
        .isEmpty(),
      check("completionDate", "Please select a completion date")
        .not()
        .isEmpty()
    ]
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
      status,
      completionDate
    } = req.body;

    //Initialise the ticket field object
    const ticketFields = {};
    if (title) ticketFields.title = title;
    if (description) ticketFields.description = description;
    if (priority) ticketFields.priority = priority;
    if (type) ticketFields.type = type;
    if (comments) ticketFields.comments = comments;
    if (status) ticketFields.status = status;
    if (completionDate) ticketFields.completionDate = completionDate;

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

      ticketFields.comments = {
        user: user.id,
        name: user.name,
        role: user.role,
        text: "Ticket created"
      };

      //Find project that the ticket is for
      const project = await Project.findById(req.params.id_project);

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

      //Create and save the new ticket and save the updated project too
      const newTicket = new Ticket(ticketFields);

      const ticket = await newTicket.save();
      await project.save();
      res.json(ticket);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/tickets/:id_ticket
// @desc    Update a ticket
// @access   Private

router.put(
  "/:id_ticket",
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
      let commentUpdates = [];
      for (const [key, value] of Object.entries(update)) {
        let commentLine = `${key} was updated to '${value}'.`;
        commentUpdates.unshift(commentLine);
      }
      const user = await User.findById(req.user.id).select("-password");
      commentUpdates.map(comment => {
        const commentUpdate = {
          text: comment,
          name: user.name,
          user: req.user.id,
          role: user.role
        };
        ticket.comments.unshift(commentUpdate);
      });

      console.log(ticket.comments);

      await Ticket.findByIdAndUpdate(ticketId, update);
      const newTicket = await Ticket.findById(ticketId);
      res.json(newTicket);
    } catch (err) {
      console.error(err.msg);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/tickets/:id_ticket
// @desc    Delete a ticket
// @access   Private
router.delete(
  "/:id_ticket",
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

// @route   POST api/tickets/comment/:id_ticket
// @desc    Add a comment to a ticket
// @access   Private

router.put(
  "/comment/:id_ticket",
  [
    auth,
    roleAuth("updateOwn", "Ticket"),
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const ticket = await Ticket.findById(req.params.id_ticket);
      console.log("ticket" + ticket);
      if (!ticket) {
        return res.status(404).json({ msg: "Ticket not found" });
      }
      console.log(req.user.id);
      // Check on if owner is deleting ticket
      if (ticket.owner.user.toString() !== req.user.id) {
        return res.status(404).json({ msg: "User not authorise" });
      }

      const user = await User.findById(req.user.id).select("-password");
      console.log("user1" + user);

      const newComment = {
        text: req.body.text,
        name: user.name,
        user: req.user.id,
        role: user.role
      };
      console.log(newComment);

      ticket.comments.unshift(newComment);
      res.json(ticket);
      await ticket.save();
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
