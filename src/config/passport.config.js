import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import local from "passport-local";
import User from "../dao/models/users.models.js";
import { createHash, isValidPassword } from "../utils/cryptPassword.utils.js";

const LocalStrategy = local.Strategy;

export const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await User.findOne({ email: username });

          if (user) {
            console.log("El usuario ya existe");
            return done(null, false);
          }

          const newUserInfo = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };

          if (email === "adminCoder@coder.com") {
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

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ email: username });

          if (!user) {
            console.log("El usuario no existe");
            return done(null, false);
          }

          if (!isValidPassword(user, password)) return done(null, false);

          return done(null, user);
        } catch (error) {
          console.log(error);
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
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({ googleId: profile._json.sub });

          if (!user) {
            const newUserInfo = {
              googleId: profile._json.sub,
              first_name: profile._json.given_name,
              last_name: profile._json.family_name,
              age: 29,
              email: profile._json.email,
              password: "",
              role: "google-user",
            };

            const newUser = await User.create(newUserInfo);

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
