import express from "express";
import { createChat,getChat } from "../controllers/chat.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
const router=express.Router();
router.post("/chats", authUser, createChat);
router.get("/chat/:projectId", authUser, getChat);

export default router;