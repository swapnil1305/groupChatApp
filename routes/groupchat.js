const express = require('express');

const auntheticateController = require('../middleware/auth');
const grpcontroller = require('../controller/groupchat');

const router = express.Router();

router.get('/groupusers/getname', grpcontroller.getgroupuser);
router.post('/group/removemember', auntheticateController.authenticate, grpcontroller.removeuser);
router.post('/group/makememberadmin', auntheticateController.authenticate, grpcontroller.makememberadmin);

module.exports = router;