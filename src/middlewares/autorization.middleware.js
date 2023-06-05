export const autorization = (role) => {
  return async (req, res, next) => {
    const payload = req.user.payload;

    if (!payload) return res.status(401).json({ error: "Unauthorized" });

    if (
      payload.role !== role[0] &&
      payload.role !== role[1] &&
      payload.role !== role[2] &&
      payload.role !== role[3]
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
};
