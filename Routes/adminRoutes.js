import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = express.Router();

router.get("/addNew" , ClerkExpressRequireAuth() , addUser);

export default router;