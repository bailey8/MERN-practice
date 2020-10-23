const mongoose = require("mongoose");
const { Schema } = mongoose; // const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: String,
  credits: { type: Number, default: 0 }, //Users should start with no credits
});

// Creates the collection called users in the DB
mongoose.model("users", userSchema);
