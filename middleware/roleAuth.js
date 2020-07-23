const { roles } = require("./roles");
const User = require("../models/User");

module.exports = function(action, resource) {
  return async (req, res, next) => {
    const user = await User.findById(req.user.id).select("role");

    if (!user) {
      return res.status(401).json({ message: "Not a valid user" });
    }
    try {
      const permission = await roles.can(user.role)[action](resource);

      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
