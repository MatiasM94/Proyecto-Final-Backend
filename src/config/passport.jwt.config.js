import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import GoogleStrategy from "passport-google-oauth20";
import { createUser, findOneUser } from "../services/users.service.js";
import { createHash, isValidPassword } from "../utils/cryptPassword.utils.js";
import { jwtSecretKey } from "./app/index.js";

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
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await findOneUser(id);
    done(null, user);
  });

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: jwtSecretKey,
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
          if (!first_name || !last_name || !age || !password || !username) {
            return done(null, "faltan campos por completar");
          }

          const verifyExistUser = await findOneUser({ email: username });
          if (verifyExistUser) {
            return done(null, "El usuario ya existe!");
          }

          const newUserInfo = {
            first_name,
            last_name,
            age,
            email: username,
            password: createHash(password),
          };
          const newUser = await createUser(newUserInfo);

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
          const user = await findOneUser({ email: username });

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
        secretOrKey: jwtSecretKey,
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
          const user = await findOneUser({ googleId: profile._json.sub });

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

            const newUser = await createUser(newUserInfo);
            console.log(newUser);
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
