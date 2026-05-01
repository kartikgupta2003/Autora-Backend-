// const express = require("express");
import express from "express";
const router = express.Router();
import { ClerkExpressRequireAuth  , ClerkExpressWithAuth} from "@clerk/clerk-sdk-node";
import {fetchAllChats , addNewChat} from "../Controllers/chats.js";

router.get("/fecthChats" , ClerkExpressRequireAuth() , fetchAllChats);
router.post("/addChat" , ClerkExpressRequireAuth() , addNewChat);

export default router ;