import express from "express";
const router = express.Router();
import { ClerkExpressRequireAuth , ClerkExpressWithAuth} from "@clerk/clerk-sdk-node";
import {getAdminTestDrives , updateTestDriveStatus , getDashBoardData} from "../Controllers/admin.js";
import authAdmin from "../Middlewares/adminMiddleware.js";

router.get("/fetchDrives" , ClerkExpressRequireAuth() , authAdmin , getAdminTestDrives);
router.get("/updateDrives" , ClerkExpressRequireAuth() , authAdmin , updateTestDriveStatus);
router.get("/fetch-dashboard" , ClerkExpressRequireAuth() , authAdmin , getDashBoardData);

export default router ;