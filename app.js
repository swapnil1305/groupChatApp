const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');
const User = require('./models/signup');
const Chat = require('./models/chat');
const Group = require('./models/group');
const usergroup = require('./models/usergroup');


var cors = require('cors');
const app = express();

app.use(cors({
    origin: "null",
    methods: ["GET", "POST"],
}));

const userRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const chatRoutes = require('./routes/chat');
const groupRoutes = require('./routes/group');
const groupchatRoutes = require('./routes/groupchat');


app.use(bodyParser.json({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoutes);
app.use(loginRoutes);
app.use(chatRoutes);
app.use(groupRoutes);
app.use(groupchatRoutes);

app.use((req, res) => {
    console.log(req.url)
    res.sendFile(path.join(__dirname, `frontendChat/${req.url}`))
})

User.hasMany(Chat);
Chat.belongsTo(User);
User.belongsToMany(Group, { through: 'usergroup', foreignKey: 'signupId' });
Group.belongsToMany(User, { through: 'usergroup', foreignKey: 'groupId' });

sequelize
    .sync()
    // .sync({force: true})
    .then(result => {
        app.listen(4000);
    })
    .catch(err => {
        console.log(err);
    });