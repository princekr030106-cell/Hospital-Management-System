
const express=require('express')
const {
  sendMessage,
  getAllMessages,
} =require ("../controller/messageController.js");
const { isAdminAuthenticated } =require("../middlewares/auth.js");

const router = express.Router();


router.post("/send", sendMessage);
router.get("/getall", isAdminAuthenticated, getAllMessages);

module.exports=router;