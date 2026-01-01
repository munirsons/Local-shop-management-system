export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.designation)) {
      return res.status(403).json({ message: "Unautherized Role" });
    }
    next();
  };
};
