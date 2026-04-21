/* import * as issueService from "../services/issue.service.js";

export const create = async (req, res, next) => {
  try {
    const issue = await issueService.createIssue(req.body, req.user.id);
    res.status(201).json(issue);
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const data = await issueService.getIssues(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const issue = await issueService.getIssueById(req.params.id);
    res.json(issue);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const issue = await issueService.updateIssue(req.params.id, req.body);
    res.json(issue);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await issueService.deleteIssue(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
}; */





import Issue from "../models/issue.model.js";

// GET /api/issues
export const getAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      status,
      priority,
      severity,
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (severity) filter.severity = severity;

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [issues, total] = await Promise.all([
      Issue.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Issue.countDocuments(filter),
    ]);

    res.json({ issues, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/issues/:id
export const getOne = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/issues
export const create = async (req, res) => {
  try {
    const { title, description, priority, severity, assignee, tags } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const issue = await Issue.create({
      title,
      description,
      priority,
      severity,
      assignee: assignee || null,
      tags: tags || [],
      createdBy: req.user._id,
    });

    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/issues/:id
export const update = async (req, res) => {
  try {
    const { title, description, status, priority, severity, assignee, tags } = req.body;

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(severity !== undefined && { severity }),
        ...(assignee !== undefined && { assignee }),
        ...(tags !== undefined && { tags }),
      },
      { new: true, runValidators: true }
    );

    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/issues/:id
export const remove = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json({ message: "Issue deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};