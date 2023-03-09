import passport from "passport";
import passportjwt from "passport-jwt";
const JWTStrategy = passportjwt.Strategy;
const ExtractJWT = passportjwt.ExtractJwt;
import env from "./environment.js";
import User from "../models/user.js";

let opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwt_secret,
};

passport.use(
  new JWTStrategy(opts, function (jwtPayLoad, done) {
    User.findById(jwtPayLoad._id, function (err, user) {
      if (err) {
        console.log("Error in finding user from JWT");
        return;
      }

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

export default passport;
