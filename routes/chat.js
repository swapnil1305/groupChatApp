const express = require('express');
const chatcontroller = require('../controller/chat');
const auntheticateController = require('../middleware/auth');

const router = express.Router();

router.get('/users/chat', chatcontroller.getchat);
router.post('/users/chat', auntheticateController.authenticate, chatcontroller.postchat);

router.post('/sendfile/:groupId',auntheticateController.authenticate,messageControllers.uploadFile);

module.exports = router;