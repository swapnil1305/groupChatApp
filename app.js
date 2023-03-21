const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const sequelize=require('./util/database');
const User=require('./models/signup');
const Chat=require('./models/chat');


var cors =require('cors');
const app = express();

app.use(cors({
    origin:"null",
    methods:["GET","POST"],
}));

const userRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const chatRoutes = require('./routes/chat');


app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoutes);
app.use(loginRoutes);
app.use(chatRoutes);

app.use((req,res)=>{
console.log('url',req.url);
//res.sendFile(path.join(__dirname,`Expensetrackerfrontend/${req.url}`))
})

User.hasMany(Chat);
Chat.belongsTo(User);

sequelize
.sync()
// .sync({force: true})
.then(result=>{
   app.listen(4000);
})
.catch(err=>{
    console.log(err);
});