import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import GoogleStrategy from "passport-google-oauth20";
import { createHash, isValidPassword } from "../utils/cryptPassword.utils.js";
import { jwtSecretKey } from "./app/index.js";
import { userService } from "../repositories/index.js";
import CurrentDTO from "../DTOs/Current.dto.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.authToken || req.cookies.emailToken;
  }
  return token;
};

const cookieMailExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.emailToken;
  }
  return token;
};

const initializePassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userService.findOne(id);

    done(null, user);
  });

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieMailExtractor]),
        secretOrKey: jwtSecretKey,
      },
      async (jwt_payload, done) => {
        try {
          console.log(jwt_payload);
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
        const newUserInfo = { username, password, body: req.body, done };
        try {
          const newUser = await userService.create(newUserInfo);
          if (newUser.error) return done(newUser.error);

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
          const userInfo = await userService.findOne({ email: username });
          const { user } = userInfo;
          if (!user) {
            return done(null, {
              error: "El usuario o contraseña no es valido",
            });
          }
          if (!isValidPassword(user, password)) {
            return done(null, {
              error: "El usuario o contraseña no es valido",
            });
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
        secretOrKey: jwtSecretKey,
      },
      async (jwt_payload, done) => {
        try {
          const { payload } = jwt_payload;
          const currentInfo = new CurrentDTO(payload);
          return done(null, { payload: currentInfo });
        } catch (error) {
          console.log(error);
          return done(error);
        }
      }
    )
  );

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID:
          "108529311724-ahp60riig4vm92qi9iiaqvsmi97k78eh.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:3000/api/auth/google/callback",
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          const user = await userService.findOne({
            googleId: profile._json.sub,
          });

          if (!user.user) {
            const newUserInfo = {
              googleId: profile._json.sub,
              username: profile._json.name,
              password: "",
              role: "google-user",
              done,
              body: {
                first_name: profile._json.given_name,
                last_name: profile._json.family_name,
                age: 29,
              },
            };
            const newUser = await userService.create(newUserInfo);

            return done(null, newUser);
          }

          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

export default initializePassport;
