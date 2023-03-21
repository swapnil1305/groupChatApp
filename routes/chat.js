const express=require('express');
const chatcontroller=require('../controller/chat');
const auntheticateController=require('../middleware/auth');

const router=express.Router();

router.post('/users/chat',auntheticateController.authenticate,chatcontroller.chat);

module.exports=router;