const express=require('express');

const logincontroller=require('../controller/login');

const router=express.Router();

router.post('/users/login',logincontroller.login);

module.exports=router;