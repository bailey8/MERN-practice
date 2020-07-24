const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");

// Express App listens for requests and routes them to different route handlers
// All our route handlers will be registered with this App
const app = express();

//------------------Handle cookies ---------------------------
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey] // Used to encrypt cookie - don't commit to git
  })
);

app.use(passport.initialize())
app.use(passport.session());

//----------------- Mongoose config --------------------------
const mongoose = require("mongoose");
mongoose.connect(keys.mongoURI);

// Will automatically get executed
require("./models/User"); // Must be imported first, before passport
require("./services/passport");

// -------------------Routes ----------------------------------
// --------------Dont do it this way -------------------
// const authRoutes = require("./routes/authRoutes");
// authRoutes(app);
require("./routes/authRoutes")(app);

const PORT = process.env.PORT || 5000; // Heroku sets this, in development use 5000
app.listen(PORT);
