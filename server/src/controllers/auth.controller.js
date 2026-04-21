import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Helper to sign JWT token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// Return only public user info (no password)
const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body; // data from client

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash password before saving
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    // Sign JWT and return user data (without password)
    const token = signToken(user._id);

    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare provided password with hashed password in DB
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Sign JWT and return user data (without password)
    const token = signToken(user._id);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




// PUT /api/auth/me  (protected)
export const updateMe = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if new email is already taken by someone else
    if (email && email !== req.user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    // Update user's name/email (only if provided)
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...(name && { name }), ...(email && { email }) },
      { new: true }
    );

    res.json({ user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};