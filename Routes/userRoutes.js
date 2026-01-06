// const express = require("express");
import express from "express";
const router = express.Router();
import { ClerkExpressRequireAuth  , ClerkExpressWithAuth} from "@clerk/clerk-sdk-node";
import multer  from "multer";
const upload = multer({ storage: multer.memoryStorage() });
import {getFeaturedCars ,processImageSearch}  from "../Controllers/user.js";
import authAdmin  from "../Middlewares/adminMiddleware.js";


router.post("/searchImage" , ClerkExpressWithAuth() , upload.single("image") , processImageSearch);
                        //Accept only one file upload
                        //The file must be in form-data field named "image"
                        // upload.array("images", maxNumber) for allowing multiple files to be uploaded


router.get("/fetchCars" , ClerkExpressWithAuth() , getFeaturedCars);

export default router ;