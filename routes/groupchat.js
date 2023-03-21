const express=require('express');
const grpcontroller=require('../controller/groupchat');

const router=express.Router();

router.get('/groupusers/getname',grpcontroller.getgroupuser);
module.exports=router;