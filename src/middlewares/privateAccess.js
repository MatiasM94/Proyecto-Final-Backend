export function privateAccess(req, res, next) {
  if (!req.session.user) return res.redirect("/");

  next();
}
