const express = require("express");

// Mongoose config
const mongoose = require('mongoose');
const keys = require('./config/keys')
mongoose.connect(keys.mongoURI)


// Will automatically get executed
require("./services/passport");
require('./models/User')

// This is our express App. It listens for requests and routes them to different route handlers
// All our route handlers will be registered with this App
const app = express();


// --------------Dont do it this way -------------------
// const authRoutes = require("./routes/authRoutes");
// authRoutes(app);
//-----------Instead do it this way -------------------------
require('./routes/authRoutes')(app)




const PORT = process.env.PORT || 5000; // Heroku sets this, and in development use 5000
app.listen(PORT);
// app.listen(5000) - static port binding
