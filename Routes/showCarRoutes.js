import express from "express";
const router = express.Router();
import { ClerkExpressRequireAuth , ClerkExpressWithAuth} from "@clerk/clerk-sdk-node";
import {getCarFilters , getCars , toggleSavedCar , getSavedCars , getCarById , getCarForTestDrive} from "../Controllers/showCars.js";

router.get("/carFilters" , getCarFilters);
router.get("/fetchCar" , ClerkExpressWithAuth() , getCars); // This middleware: Tries to authenticate , does NOT block unauthenticated users , adds req.auth only if logged in
router.get("/toggleCar" , ClerkExpressRequireAuth() , toggleSavedCar);
router.get("/fetchSavedCars" , ClerkExpressRequireAuth() , getSavedCars);
router.get("/getCar" , ClerkExpressRequireAuth() , getCarById);
router.get("/get-car" , ClerkExpressRequireAuth() , getCarForTestDrive);

export default router ;