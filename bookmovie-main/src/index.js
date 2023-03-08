const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;
const path = require('path')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { connection } = require("./connector");
const cors = require('cors');
const { bookMovieSchema } = require('./schema')
app.use(cors())

app.use(express.json())

const appRouter = express.Router();
app.use("/api",appRouter) 

appRouter.route("/booking").post( async (req,res)=>{
    let dObject = req.body;
    const newBooking = new connection({
        ...req.body
    })
    const bookingData = await newBooking.save();
    res.status(200).json(bookingData);
})

appRouter.route("/booking").get(async (req,res)=>{
    const bookings = await connection.find().sort({createdAt: 1});
    const lastbooking = bookings[bookings.length-1];
    if(lastbooking){
        res.send(lastbooking);
    }else{
        res.send({});
    }
})


app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;   