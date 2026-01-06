import express from "express";
const router = express.Router();
import {handleLogin , checkAdmin}from "../Controllers/auth.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

router.post("/addUser" ,handleLogin);
router.get("/verify-admin" , ClerkExpressRequireAuth() , checkAdmin);

export default router ;