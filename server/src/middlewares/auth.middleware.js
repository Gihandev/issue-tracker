import jwt from "jsonwebtoken";

// Middleware to protect routes
export const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Expect "Bearer <token>"

    if (!token) throw new Error("Not authorized");

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded;

    next(); //pass to next functions
  } catch {
    res.status(401);
    next(new Error("Unauthorized")); 
  }
};