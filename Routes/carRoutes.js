import express from "express";
const router = express.Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
import {addCarController , fetchCars , deleteCar , updateCarStatus} from "../Controllers/cars.js";
import authAdmin from "../Middlewares/adminMiddleware.js";


router.post("/addCar" , ClerkExpressRequireAuth() , authAdmin , upload.array("images" , 10) , addCarController);
                        //Accept only one file upload
                        //The file must be in form-data field named "image"
                        // upload.array("images", maxNumber) for allowing multiple files to be uploaded


router.get("/fetch" , ClerkExpressRequireAuth() , authAdmin , fetchCars);
router.delete("/delete/:id" , ClerkExpressRequireAuth() , authAdmin , deleteCar);
router.post("/update" , ClerkExpressRequireAuth(), authAdmin , updateCarStatus);

export default router ;