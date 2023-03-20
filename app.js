const path = require('path');
const cors =require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize=require('./util/database');
const User=require('./models/signup');

const app = express();

app.use(cors({
    origin:"null",
    methods:["GET"],
}));

const usersrouteRoutes = require('./routes/signup');

app.use(bodyParser.json({ extended: false }));

app.use(usersrouteRoutes);

sequelize
.sync()
// .sync({force: true})
.then(result=>{
   app.listen(4000);
})
.catch(err=>{
    console.log(err);
}); 