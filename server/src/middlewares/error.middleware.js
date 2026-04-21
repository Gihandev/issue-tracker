
// Centralized error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(res.statusCode !== 200 ? res.statusCode : 500).json({
    message: err.message || "Server Error",
  });
};