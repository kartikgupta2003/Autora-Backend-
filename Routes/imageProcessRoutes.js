import express from "express";
const router = express.Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import processCarImagewithAI from "../Controllers/processImage.js";
import multer from "multer";
// Store file in memory buffer (not local disk)
const upload = multer({ storage: multer.memoryStorage() });
// Multer is a Node.js middleware used with Express to handle file uploads. It helps you process multipart/form-data, which is the format most browsers use when sending files. Without Multer, Express cannot understand file uploads because Express only handles: JSON requests or URL-encoded form data
// So Multer acts like a file handler between the client and the server.

// 📍 Step-by-step flow

// User selects a file on frontend (e.g. through react-dropzone or <input type="file">)
// File is sent to backend via multipart/form-data using FormData()
// Multer receives the request and reads the file
// It stores the file temporarily (in memory or disk)
// You can then:
// Upload it to Cloudinary / S3 / Firebase
// Convert to Base64
// Save file URL into MongoDB

import authAdmin from "../Middlewares/adminMiddleware.js";


router.post("/ai" , ClerkExpressRequireAuth()  , upload.single("image") , processCarImagewithAI);
                        //Accept only one file upload
                        //The file must be in form-data field named "image"
                        // upload.array("images", maxNumber) for allowing multiple files to be uploaded


export default router ;