import express from "express";
const router = express.Router();
import { ClerkExpressRequireAuth , ClerkExpressWithAuth} from "@clerk/clerk-sdk-node";
import {bookTestDrive , getUserTestDrives , cancelTestDrive} from "../Controllers/testDrive.js";
import authAdmin from "../Middlewares/adminMiddleware.js";

router.post("/book" , ClerkExpressRequireAuth() , bookTestDrive);
router.get("/fetch" , ClerkExpressRequireAuth() , getUserTestDrives);
router.get("/delete",ClerkExpressRequireAuth(), cancelTestDrive);

export default router ;