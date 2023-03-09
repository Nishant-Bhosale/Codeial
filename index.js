import express from "express";
import env from "./config/environment.js";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
import getAssetPath from "./config/view-helpers.js";
getAssetPath(app);
const port = 8000;
import expressLayouts from "express-ejs-layouts";
import db from "./config/mongoose.js";
// used for session cookie
import session from "express-session";
import passport from "passport";
import passportLocal from "./config/passport-local-strategy.js";
import passportJWT from "./config/passport-jwt-strategy.js";
import passportGoogle from "./config/passport-google-oauth2-strategy.js";

import cm from "connect-mongo";
const MongoStore = cm(session);
import sassMiddleware from "node-sass-middleware";
import flash from "connect-flash";
import { setFlash } from "./config/middleware.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// setup the chat server to be used with socket.io
import http from "http";
const chatServer = http.Server(app);
import { chatSockets } from "./config/chat_sockets.js";
chatSockets(chatServer);
chatServer.listen(5000);
console.log("chat server is listening on port 5000");
import path from "path";

app.use(cors());

if (env.name === "development") {
  app.use(
    sassMiddleware({
      src: path.join(__dirname, env.asset_path, "scss"),
      dest: path.join(__dirname, env.asset_path, "css"),
      debug: true,
      outputStyle: "extended",
      prefix: "/css",
    })
  );
}

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static(env.asset_path));
// make the uploads path available to the browser
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// mongo store is used to store the session cookie in the db
app.use(
  session({
    name: "codeial",
    // TODO change the secret before deployment in production mode
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(setFlash);

// use express router
import routes from "./routes/index.js";
app.use("/", routes);

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
});
