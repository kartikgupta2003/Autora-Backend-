import express from "express";
const router = express.Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import authAdmin from "../Middlewares/adminMiddleware.js";
import {getDealershipInfo , saveWorkingHours , getUsers , updateUserRole} from "../Controllers/settings.js";


router.get("/getDealership" , ClerkExpressRequireAuth() , authAdmin , getDealershipInfo);
router.post("/update" , ClerkExpressRequireAuth() , authAdmin , saveWorkingHours);
router.get("/fetchUsers" , ClerkExpressRequireAuth() , authAdmin , getUsers);
router.post("/updateUser" , ClerkExpressRequireAuth() , authAdmin , updateUserRole);

export default router ;