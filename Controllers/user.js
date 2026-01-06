import Car from "../Models/carModel.js";
import aj from "../Config/arcjet.js";
import asyncHandler from "express-async-handler";
import genAI from "../Config/Gemini.js";
import { serializeCarData } from "./helper.js";
import UserSavedCar from "../Models/userSavedCarModel.js";
import User from "../Models/userModel.js";

export const getFeaturedCars = asyncHandler(async (req, res, next) => {
    const limit = 3;
    const clerkId = req?.auth?.userId;
    try {
        const cars = await Car.find({
            featured: true,
            status: "AVAILABLE"
        }).sort({ createdAt: -1 }).limit(limit);


        // limit controls how many documents (cars) are returned from the database.
        // Order matters(very important 👇)
        //     .sort({ createdAt: -1 })
        //     .limit(3)
        // This means:
        // Sort all matching cars by newest first
        // Pick only the first 3
        // console.log(cars)
        const user = await User.findOne({ clerkUserId: clerkId });

        let wishListed = new Set();

        if (user) {
            const savedCars = await UserSavedCar.find({ userId: user._id });

            wishListed = new Set(savedCars?.map((saved) => saved.carId.toString()));
        }
        // console.log(wishListed)

        const serializedCars = cars.map((car) => {
            // console.log(car._id)
            if (wishListed.has(car._id.toString())) console.log("mil gaya");
            return serializeCarData(car._doc, wishListed.has(car._id.toString()));
        })

        return res.send(serializedCars);
    } catch (err) {
        const error = new Error("Error fetching featured cars: " + err.message);
        next(err);
    }
})

export const processImageSearch = asyncHandler(async (req, res, next) => {
    // console.log("no problem 1");
    try {
        // Rate limiting with Arcjet
        const decision = await aj.protect(req, {
            requested: 1
        }); // with each request 1 token from the bucket will be consumed !
        // console.log("no problem 2");
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                const { remaining, reset } = decision.reason;

                console.error({
                    code: "RATE_LIMIT_EXCEEDED",
                    details: {
                        remaining,
                        resetInSeconds: reset
                    }
                })
                // console.log("no problem 3");
                throw new Error("Too many requests. Please try again later.");
            }
            // console.log("no problem 4");
            throw new Error("Request blocked");
        }
        // console.log("no problem 5");

        const base64Image = req?.file?.buffer.toString("base64");
        const mimeType = req?.file?.mimetype;

        // console.log("no problem 6");
        if (!base64Image) {
            const err = new Error("Please send a valid image to search");
            err.status = 400;
            throw (err);
        }

        // console.log("no problem 7");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType
            }
        };

        const prompt = `
      Analyze this car image and extract the following information for a search query:
      1. Make (manufacturer)
      2. Body type (SUV, Sedan, Hatchback, etc.)
      3. Color

      Format your response as a clean JSON object with these fields:
      {
        "make": "",
        "bodyType": "",
        "color": "",
        "confidence": 0.0
      }

      For confidence, provide a value between 0 and 1 representing how confident you are in your overall identification.
      Only respond with the JSON object, nothing else.
    `;

        const result = await model.generateContent([imagePart, prompt]);
        let text = result.response.text();
        text = text.replace(/```json|```/g, "").trim();

        // console.log("no problem 8");
        try {
            const carDetails = JSON.parse(text);
            // console.log("car ", carDetails);

            return res.send(carDetails);

        } catch (err) {
            // console.error("Failed to parse AI response : " + err);
            const error = new Error("Failed to parse AI response");
            next(error);
        }
    } catch (err) {
        const error = new Error("Gemini API error :" + err.message);
        next(error);
    }
})

// module.exports = {
//     getFeaturedCars ,
//     processImageSearch
// }