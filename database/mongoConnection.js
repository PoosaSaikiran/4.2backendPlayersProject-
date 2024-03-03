const mongoose = require("mongoose");

const connection = mongoose.connect('mongodb+srv://admin:admin@atlascluster.uj9mkto.mongodb.net/saikiran')
.then((req)=>{
    console.log("Database connected")
}).catch(error => {
    console.log(error);
});

module.exports = connection;

require('../schemas/usa_soccer_stats');


