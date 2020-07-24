const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");

// This is how you pull a schema out of mongoose. We load the schema in the models class, and pull it out here to work with it
const User = mongoose.model("users");

// --- Define how the cookie will be made ----------------
passport.serializeUser((user, done) => {
  done(null, user.id);   // this is not the profileId, this is the record ID - decouples code from auth provider
});

// ------ Define how cookie will be parsed and what will be added to req object ---------------
passport.deserializeUser((id, done) => { // First arg is the identifier we put in the cookie
  User.findById(id).then((user) => {
    done(null, user); // The user record is attached to the request object
  });
});

// ----- Define what app does when user returns from auth server w access token -------
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      // This has to be set in the google console as a verified redirect URI
      callbackURL: "/auth/google/callback",
      proxy:true
    },

    // Opportunity to create new user inside DB
    (accessToken, refreshToken, profile, done) => {
      // Check if user exists, don't want to make 2 accounts for the same user
      User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
          //If the user exists don't create a new one
          done(null, existingUser); // This user is passed to serializeUser
        } else {
          //If the user doensn't exist, create one
          new User({ googleId: profile.id }).save().then((user) => done(null, user)); // This user is passed to serializeUser
        }
      });
    }
  )
);
