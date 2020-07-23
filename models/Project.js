const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  owner: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    name: {
      type: String
    },
    email: {
      type: String
    },
    role: {
      type: String
    }
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  users: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
      },
      email: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      role: {
        type: String,
        enum: ["developer", "projectLead", "admin"],
        default: "developer"
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Projects = mongoose.model("project", ProjectSchema);
