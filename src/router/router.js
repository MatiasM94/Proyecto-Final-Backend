import { Router } from "express";
import passport from "passport";

class Route {
  constructor() {
    this.router = Router();
    this.init();
  }

  getRouter() {
    return this.router;
  }

  init() {}

  get(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomeResponses,
      this.applyCallbacks(callbacks)
    );
  }

  post(path, policies, ...callbacks) {
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.generateCustomeResponses,
      this.applyCallbacks(callbacks)
    );
  }

  put(path, policies, ...callbacks) {
    this.router.put(
      path,
      this.handlePolicies(policies),
      this.generateCustomeResponses,
      this.applyCallbacks(callbacks)
    );
  }

  delete(path, policies, ...callbacks) {
    this.router.delete(
      path,
      this.handlePolicies(policies),
      this.generateCustomeResponses,
      this.applyCallbacks(callbacks)
    );
  }

  generateCustomeResponses = (req, res, next) => {
    res.sendSucces = (payload) => res.json({ status: 200, payload });
    res.sendServerError = (error) => res.json({ status: 500, error });
    res.sendUserError = (error) => res.json({ status: 400, error });
    next();
  };

  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (error) {
        console.log(error);
        params[1].status(500).json({ error });
      }
    });
  }

  handlePolicies = (policies) => {
    if (policies[0] === "PUBLIC") {
      return (req, res, next) => {
        next();
      };
    }
    return async (req, res, next) => {
      passport.authenticate("jwt", function (err, user, info) {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({
            error: info.messages ? info.messages : "Ocurrio un error",
          });
        }

        if (user.role !== policies[0] && user.role !== policies[1]) {
          return res
            .status(403)
            .json({ error: "No tenes permisos para acceder" });
        }

        req.user = user;
        next();
      })(req, res, next);
    };
  };
}

export default Route;
