const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;


// This is our express App. It listens for requests and routes them to different route handlers
// All our route handlers will be registered with this App
const app = express()

// new GoogleStrategy(args) creates a new instance of the google passport strategy
// the args specify how exactly we want to authenticate with google
// passport.use() makes passport aware of the oauth strategy
passport.use(new GoogleStrategy());



const PORT = process.env.PORT || 5000 // Heroku sets this, and in development use 5000
app.listen(PORT)
// app.listen(5000) - static port binding