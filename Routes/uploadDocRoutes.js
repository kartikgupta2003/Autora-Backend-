import express from "express";
import {uploadDoc , deleteDoc} from "../Controllers/uploadDoc.js";
import { ClerkExpressRequireAuth  , ClerkExpressWithAuth} from "@clerk/clerk-sdk-node";

const router = express.Router();

router.post("/upload"  , ClerkExpressRequireAuth() , uploadDoc);
router.patch("/remove" , ClerkExpressRequireAuth() , deleteDoc);

export default router;