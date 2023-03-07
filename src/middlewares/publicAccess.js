export function publicAccess(req, res, next) {
  if (req.session.user) return res.redirect("/profile");

  next();
}
