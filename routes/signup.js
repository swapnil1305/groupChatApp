const path= require('path');

const express=require('express');
const userscontroller=require('../controller/signup');

const router=express.Router();

router.post('/users/signup',userscontroller.signup);

module.exports=router;