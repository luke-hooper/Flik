const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project"
  },
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
  title: {
    type: String
  },
  description: {
    type: String
  },
  priority: {
    type: String,
    default: "medium",
    enum: ["low", "medium", "high"]
  },
  type: {
    type: String,
    enum: ["bug", "featureReq", "review", "other"]
  },
  status: {
    type: String,
    enum: ["waiting", "inProgress", "completed", "abadonned"]
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      role: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  },
  completionDate: {
    type: Date,
    required: true
  }
});

module.exports = Ticket = mongoose.model("ticket", TicketSchema);
