// const express = require("express");
import express from "express";
const router = express.Router();
import { ClerkExpressRequireAuth  , ClerkExpressWithAuth} from "@clerk/clerk-sdk-node";
import {fetchAllChats , updateActiveDoc , addNewChat} from "../Controllers/qachats.js";

router.get("/fecthChats" , ClerkExpressRequireAuth() , fetchAllChats);
router.patch("/updateDoc" , ClerkExpressRequireAuth() , updateActiveDoc);
router.post("/addChat" , ClerkExpressRequireAuth() , addNewChat);

export default router ;