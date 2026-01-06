import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// console.log("key ayi " , process.env.GEMINI_API_KEY);
// It gives you access to Google’s Gemini API client, so you can call the AI model.

export default genAI;