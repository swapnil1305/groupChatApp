const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize=require('./util/database');
const User=require('./models/signup');

const cors =require('cors');

const app = express();

app.use(cors({
    origin:"null",
    methods:["GET", "POST"],
}));

const usersRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(usersRoutes);
app.use(loginRoutes);

app.use((req,res)=>{
console.log('url',req.url);
//res.sendFile(path.join(__dirname,`Expensetrackerfrontend/${req.url}`))
})

sequelize
.sync()
//.sync({force: true})
.then(result=>{
   app.listen(4000);
})
.catch(err=>{
    console.log(err);
});