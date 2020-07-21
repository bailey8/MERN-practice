const express = require('express')

// This is our express App. It listens for requests and routes them to different route handlers
// All our route handlers will be registered with this App
const app = express()

app.get('/', (req,res) => {
    res.send({hi:'there'})
})



const PORT = process.env.PORT || 5000 // Heroku sets this, and in development use 5000
app.listen(PORT)
// app.listen(5000) - static port binding