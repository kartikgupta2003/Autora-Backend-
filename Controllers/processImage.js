import genAI from "../Config/Gemini.js";
import asyncHandler from "express-async-handler";
import cloudinary from "../Config/cloudinary.js";


// Computers store images as binary (0s and 1s), but sometimes we need to send them through: JSON APIs
// So Base64 converts the binary image → into a long string made of letters, numbers, +, /, and = That text represents the same image, just in a format that can travel through JSON.
// OpenAI , Gemini like AI API uploads require Base64 format 

const processCarImagewithAI = asyncHandler(async(req,res,next)=>{
    const base64Image = req?.file?.buffer.toString("base64");
    const mimeType = req?.file?.mimetype;

    
    if(!base64Image){
        const err =  new Error("Please send a valid image to search");
        err.status=400;
        throw(err);
    }
    
    try{
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const imagePart = {
            inlineData : {
                data : base64Image ,
                mimeType
            }
        };

        const prompt = `
        Analyze this car image and extract the following information:
        1. Make(manufacturer)
        2. Model 
        3. Year (approximately) in string format 
        4. Color
        5. Body type {SUV,Sedan,Hatchback,Convertible,Coupe,Wagon,Pickup} select out of these options only
        6. Mileage (km/l) in string format 
        7. Fuel type (your best guess) {Petrol, Diesel, Electric, Hybrid, Plug-in Hybrid} select out of these options only
        8. Transmission type (your best guess) {Automatic, Manual, Semi-Automatic} select out of these options only
        9. Price (your best guess) in dollars (without any dollar sign and ',' between digits) in string format 
        10. Short Description as to be added to a car list
        
        Format your response as a clean JSON object with these fields:
      {
        "make": "",
        "model": "",
        "year": "0000",
        "color": "",
        "price": "",
        "mileage": "",
        "bodyType": "",
        "fuelType": "",
        "transmission": "",
        "description": "",
        "confidence": 0.0
      }

      For confidence, provide a value between 0 and 1 representing how confident you are in your overall identification.
      Only respond with the JSON object, nothing else.`;

      const result = await model.generateContent([imagePart , prompt]);
      let text = result.response.text();
      text = text.replace(/```json|```/g, "").trim();

      try{
        const carDetails = JSON.parse(text);

        // Validate the response format
      const requiredFields = [
        "make",
        "model",
        "year",
        "color",
        "bodyType",
        "price",
        "mileage",
        "fuelType",
        "transmission",
        "description",
        "confidence",
      ];
      const missingFields = requiredFields.filter((field)=>{
        return !(field in carDetails);
      })

      if(missingFields.length > 0){
        throw new Error(`AI response missing required fields : ${missingFields.join(", ")}`);
      }

    //   // ---------- CLOUDINARY UPLOAD AFTER AI SUCCESS ----------
    // const uploadResult = await new Promise((resolve, reject) => {
    //   cloudinary.uploader.upload_stream(
    //     { folder: "car-marketplace" },
    //     (error, result) => {
    //       if (error) reject(error);
    //       else resolve(result.secure_url);
    //     }
    //   ).end(req.file.buffer);
    // });

      return res.send(carDetails);

      }catch(err){
        // console.error("Failed to parse AI response : " , err);
        const error =  new Error("Failed to parse AI response");
        next(error);
      }

    }catch(err){
        const error = new Error("Gemini API error " + err.message);
        next(error);
    }
})

export default processCarImagewithAI;