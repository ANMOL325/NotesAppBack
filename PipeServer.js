
const express = require('express');
const mongoose = require('mongoose');
const monk = require('monk');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 9000;
const StatusMessage = {
    SignUpStatus: "S",
    LoginStatus: "L",
}
app.use(express.json()); 
app.use(cors());



app.get("/", (req,res) => {
    res.status(200).send("forever start Server.js");
    
})

app.get('/Restart', function (req, res, next) {
    res.status(200).send("Restart Again");
});

app.listen(port, () => {
    console.log(`Listening on localhost: ${port}`);
})



