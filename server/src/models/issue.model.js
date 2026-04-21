import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },

    priority: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      default: "medium",
    },
    severity: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    assignee: {
      type: String,
      default: null,
    },

    tags: {
      type: [String],
      default: [],
    },

    comments: {
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Issue", issueSchema);
