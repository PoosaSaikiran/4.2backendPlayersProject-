require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');
const logger = require('morgan');
const { connection } = require("./database/mongoConnection");
const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cors());
// view engine 
app.set ('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
//logging
app.use(logger("dev"));

//use connection in app
app.use((req,res,next)=>{
    req.connection = connection;
    next();
});

//routing
const routes = require('./routes')
app.use("/api",routes.player);

app.get("/",(req,res)=>{
    res.send("Hello World");
});

app.listen(port,() =>{
    console.log("server is running on port:"+ port);
})

