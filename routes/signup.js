const express=require('express');
const userscontroller=require('../controller/signup');

const router=express.Router();

router.post('/users/signup',userscontroller.signup);

router.get('/users/signup',userscontroller.getuser);
module.exports=router;