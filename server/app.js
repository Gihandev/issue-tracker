import express from "express";
import cors from "cors";
import dotenv from "dotenv";

//routes 
import authRoutes from "./src/routes/auth.routes.js";
import issueRoutes from "./src/routes/issue.routes.js";

//middleware
import { errorHandler } from "./src/middlewares/error.middleware.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

// Error handling middlewares
app.use(errorHandler);

export default app;