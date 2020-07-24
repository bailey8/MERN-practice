const mongoose = require('mongoose')
const {Schema} = mongoose; // const Schema = mongoose.Schema;


const userSchema = new Schema({
    googleId: String
})


// Creates the collection called users in the DB
mongoose.model('users',userSchema);