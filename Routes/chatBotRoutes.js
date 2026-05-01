import express from "express";
const router = express.Router();
import {getCarsForChatBot} from "../Controllers/showCars.js";
import {bookTestDriveForChatBot} from "../Controllers/testDrive.js";
import {getCarForTestDriveChatBot} from "../Controllers/showCars.js";
import chatbotMiddleware from "../Middlewares/chatbotMiddleware.js";

router.get("/fetchCars" , chatbotMiddleware , getCarsForChatBot);
router.post("/book-test-drive" , chatbotMiddleware , bookTestDriveForChatBot);
router.get("/test-drive-slots" , chatbotMiddleware , getCarForTestDriveChatBot)

export default router ;