export const autorization = (role) => {
  return async (req, res, next) => {
    if (!req.user.payload)
      return res.status(401).json({ error: "Unauthorized" });

    if (req.user.payload.role !== role[0] && req.user.payload.role !== role[1])
      return res.status(403).json({ error: "Forbidden" });

    next();
  };
};
