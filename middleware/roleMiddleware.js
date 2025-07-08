const isEmployer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "employer") {
    return res.status(403).json({
      message:
        "Access denied. Only users with 'employer' role can perform this action.",
    });
  }

  next();
};

const isSeeker = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "seeker") {
    return res.status(403).json({
      message:
        "Access denied. Only users with 'seeker' role can perform this action.",
    });
  }

  next();
};

export { isEmployer, isSeeker };
