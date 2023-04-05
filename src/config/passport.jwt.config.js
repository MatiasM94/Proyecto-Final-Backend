import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import UserManager from "../dao/managerMongo/user.managerMongo.js";
import { createHash, isValidPassword } from "../utils/cryptPassword.utils.js";

const User = new UserManager();

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.authToken;
  }
  return token;
};

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: "kjsadfniw4213",
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, age } = req.body;
        try {
          const user = await User.findOne({ email: username });
          if (user) {
            console.log("El usuario ya existe");
            return done(null, true);
          }

          const newUserInfo = {
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password),
          };

          if (username === "adminCoder@coder.com") {
            newUserInfo.role = "admin";
          } else {
            newUserInfo.role = "user";
          }

          const newUser = await User.create(newUserInfo);

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ email: username });

          if (!user) {
            console.log("El usuario no existe");
            return done(null, true);
          }
          if (!isValidPassword(user, password)) {
            console.log("contraseña invalida");
            return done(null, true);
          }

          return done(null, user);
        } catch (error) {
          console.log(error);
        }
      }
    )
  );

  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "kjsadfniw4213",
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;
