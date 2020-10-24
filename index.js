const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require('body-parser');
const keys = require("./config/keys");

// Express App listens for requests and routes them to different route handlers
// All our route handlers will be registered with this App
const app = express();

app.use(bodyParser.json());

//------------------Handle cookies -----------------------------------------------------------
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey] // Used to encrypt cookie - don't commit to git
  })
);

app.use(passport.initialize())
app.use(passport.session()); // Tells passport to use cookies


//----------------- Mongoose config --------------------------------------------------------------------
const mongoose = require("mongoose");
mongoose.connect(keys.mongoURI);

// Will automatically get executed
require("./models/User"); // Must be imported first, before passport
require("./models/Survey"); // Don't need to import recipient Model bc that is already imported in the survey model
require("./services/passport");

// -------------------Routes ---------------------------------------------------------------------------
// --------------Dont do it this way -------------------
// const authRoutes = require("./routes/authRoutes");
// authRoutes(app);
require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);
require("./routes/surveyRoutes")(app);



if (process.env.NODE_ENV === 'production') {

  // order matters here, first check client/build to match exact asset, then default to index.html file
  app.use(express.static('client/build'));

  //Serve up the index.html file if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


const PORT = process.env.PORT || 5000; // Heroku sets this, in development use 5000
app.listen(PORT);
