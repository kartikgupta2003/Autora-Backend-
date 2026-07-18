// const express = require("express");
import express from "express";
const router = express.Router();
import { ClerkExpressRequireAuth  , ClerkExpressWithAuth} from "@clerk/clerk-sdk-node";
import {fetchAllChats , updateActiveDoc , addNewChat} from "../Controllers/qachats.js";

router.get("/fecthChats" , ClerkExpressRequireAuth() , fetchAllChats);
router.patch("/updateDoc" , (req,res,next)=>{
    console.log("aya aya aya")
    next()
} , ClerkExpressRequireAuth() , (req,res,next)=>{
    console.log("aya aya aya")
    next()
} ,updateActiveDoc);
router.post("/addChat" , ClerkExpressRequireAuth() , addNewChat);

export default router ;