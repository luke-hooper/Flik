// @route   POST api/project/:id/ticket
// @desc    create a ticket for a project
// @access   Private

router.post(
  "/",
  [
    auth,
    roleAuth("createOwn", "Ticket"),
    check("title", "Ticket title is required")
      .not()
      .isEmpty(),
    check("description", "Ticket description is required")
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
