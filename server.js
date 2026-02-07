// import dotenv from "dotenv";
// dotenv.config();
import "./Config/env.js";
// const http = require("http");
import http from "http";
// const express = require("express");
import express from "express";
// const cors = require("cors");
import cors from "cors";
// const cookieParser = require("cookie-parser");
import cookieParser from "cookie-parser";
// const connectDB = require("./Config/db");
import connectDB from "./Config/db.js";
// const errorHandler = require("./Middlewares/errorMiddleware");
import errorHandler from "./Middlewares/errorMiddleware.js";
// const authRoutes = require("./Routes/authRoutes");
import authRoutes from "./Routes/authRoutes.js";
// const imageProcessRoutes = require("./Routes/imageProcessRoutes");
import imageProcessRoutes from "./Routes/imageProcessRoutes.js";
// const carRoutes = require("./Routes/carRoutes");
import carRoutes from "./Routes/carRoutes.js";
// const settingRoutes = require("./Routes/settingRoutes");
import settingRoutes from "./Routes/settingRoutes.js";
// const userRoutes = require("./Routes/userRoutes");
import userRoutes from "./Routes/userRoutes.js" ;

import showCarRoutes from "./Routes/showCarRoutes.js";
import testDriveRoutes from "./Routes/testDriveRoutes.js";
import adminTestDriveRoutes from "./Routes/adminTesDriveRoutes.js";

// const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node" ;
// console.log("CLERK_SECRET_KEY exists:", !!process.env.CLERK_SECRET_KEY);



connectDB();
const app = express();

app.set("trust proxy", true);
// app.use((req, res, next) => {
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Origin", "https://autora-frontend.vercel.app");
//     res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.header("Access-Control-Allow-Credentials", "true");
//     return res.sendStatus(200);
//   }
//   next();
// });

// app.use(cors({
//   origin:[ "http://localhost:5173",
//   "https://autora-frontend.vercel.app"
//   ] , // ✅ your frontend origin
//   credentials: true,                // ✅ allow credentials (cookies)
// }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://autora-frontend.vercel.app" ,
  "http://localhost:3000"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(ClerkExpressWithAuth());


app.use("/api/authMe" , authRoutes);
app.use("/api/processImage" , imageProcessRoutes);
app.use("/api/car", carRoutes);
app.use("/api/settings" , settingRoutes);
app.use("/api/user" , userRoutes);
app.use("/api/showCars" , showCarRoutes);
app.use("/api/test-drive" , testDriveRoutes);
app.use("/api/adminDrive", adminTestDriveRoutes);
// these 3 are going to be protected routes 
// app.use("/api/admin");
// app.use("/api/saved-cars");
// app.use("/reservations");

app.use(errorHandler);

// const port = process.env.PORT ;
// app.listen(port , ()=> console.log(`Server started at port ${port}`));

const port = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => console.log(`Server started at port ${port}`));
}

export default app;
