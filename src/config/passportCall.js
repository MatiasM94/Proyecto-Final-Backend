import passport from "passport";

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    const { email, password } = req.body;
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);
      if (!user && !email && !password) {
        return res
          .status(401)
          .json({ error: info.message ? info.message : info.toString() });
      }

      req.user = user;

      next();
    })(req, res, next);
  };
};
