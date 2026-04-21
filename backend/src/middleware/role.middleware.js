const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not found in request"
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have permission to access this route"
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };
};

module.exports = roleMiddleware;
