import cloudinary from "../Config/cloudinary.js";
import asyncHandler from "express-async-handler";
import Car from "../Models/carModel.js";
import User from "../Models/userModel.js";
// import { v2 as cloudinary } from "cloudinary";

export const addCarController = asyncHandler(async (req, res, next) => {
    // console.log("yha tak to phuch gaya");
    try {
        const files = req?.files;
        const carData = JSON.parse(req.body.carData);
        // even if you already have express.json() middleware, you still need to JSON.parse() the carData when you are sending it through FormData. express.json() only parses JSON when the request Content-Type is application/json.
        const clerkUserId = req?.auth?.userId;

        // console.log(files);
        // console.log(carData);

        if (!clerkUserId) {
            const error = new Error("Access Denied");
            error.status = 403;
            throw error;
        }

        const user = await User.findOne({ clerkUserId });

        if (!user || user.role !== "ADMIN") {
            const error = new Error("Access Denied");
            error.status = 403;
            throw error;
        }

        if ((!files) || files.length === 0) {
            const error = new Error("No images uploaded");
            error.status = 400;
            throw error;
        }

        // Upload all files to Cloudinary
        const uploadPromises = files.map((file) => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "car-marketplace" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve({
                            url: result.secure_url,
                            publicId: result.public_id
                        });
                    }
                ).end(file.buffer);
            });
        });

        const uploadedImages = await Promise.all(uploadPromises);

        const newCar = await Car.create({
            ...carData,
            images: uploadedImages,
            savedBy: user._id
        })

        res.json(newCar);

    } catch (err) {
        next(err);
    }
});


export const fetchCars = asyncHandler(async (req, res) => {
    const keyWord = req?.query?.search ? {
        $or: [
            { make: { $regex: `${req.query.search}`, $options: "i" } },
            { color: { $regex: `${req.query.search}`, $options: "i" } },
            { model: { $regex: `${req.query.search}`, $options: "i" } }
        ]
    } : {};

    const cars = await Car.find(keyWord).sort({ createdAt: -1 });

    res.send(cars);
})

export const deleteCar = asyncHandler(async(req,res)=>{
    const id = req?.params?.id;

    const car = await Car.findById(id);

    if(!car){
        const err= new Error("Car not found");
        err.status=400;
        throw err;
    }

    const deletePromises = car.images.map((img) =>
      cloudinary.uploader.destroy(img.publicId)
    );
    await Promise.all(deletePromises);

    await Car.findByIdAndDelete(id);

    return res.json({message : "Car deleted successfully"});
});

export const updateCarStatus = asyncHandler(async(req,res)=>{
    const {id} = req.body;
    const {status} = req.body;
    const {featured} = req.body ;

    const updateFields = {};

    if(status !== undefined) updateFields.status = status;
    if(featured !== undefined) updateFields.featured = featured;

    await Car.findByIdAndUpdate(id , {
        $set : updateFields
    });

    return res.json({message : "Car updated successfully"});
});

// module.exports = {
//     addCarController,
//     fetchCars,
//     deleteCar ,
//     updateCarStatus
// }