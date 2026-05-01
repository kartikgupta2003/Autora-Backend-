import Car from "../Models/carModel.js";
import asyncHandler from "express-async-handler";
import { clerkClient } from "@clerk/clerk-sdk-node";
import User from "../Models/userModel.js";
import UserSavedCar from "../Models/userSavedCarModel.js";
import TestDriveBooking from "../Models/testDriveBookingModel.js";
import DealershipInfo from "../Models/dealershipInfoModel.js";
import { serializeCarData } from "./helper.js";
import mongoose from "mongoose";

export const getCarFilters = asyncHandler(async (req, res, next) => {
    try {
        const makes = await Car.distinct("make", { status: "AVAILABLE" });
        makes.sort((a, b) => a.localeCompare(b));
        // distinct() in Mongoose is used to get unique (non-duplicate) values of a specific field from a MongoDB collection.

        const bodyTypes = await Car.distinct("bodyType", { status: "AVAILABLE" });
        bodyTypes.sort((a, b) => a.localeCompare(b));

        const fuelTypes = await Car.distinct("fuelType", { status: "AVAILABLE" });
        fuelTypes.sort((a, b) => a.localeCompare(b));

        const transmissions = await Car.distinct("transmission", { status: "AVAILABLE" });
        transmissions.sort((a, b) => a.localeCompare(b));

        const priceAggregation = await Car.aggregate([
            { $match: { status: "AVAILABLE" } },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                },
            },
        ]);
        // aggregate() in Mongoose is used to run MongoDB’s Aggregation Pipeline, which lets you transform, filter, group, and compute data in multiple steps.
        // Each stage modifies the result and passes it to the next stage.
        // $match – filter (like WHERE)
        // $group – grouping + calculations
        // _id: null → sab documents ko ek group me daal do
        // $min: "$price" → lowest car price
        // $max: "$price" → highest car price
        // _id: null → sab documents ko ek group me daal do
        // $min: "$price" → lowest car price
        // $max: "$price" → highest car price

        const priceRange =
            priceAggregation.length > 0
                ? {
                    min: Number(priceAggregation[0].minPrice),
                    max: Number(priceAggregation[0].maxPrice),
                }
                : { min: 0, max: 100000 };

        res.json({
            data: {
                makes,
                bodyTypes,
                fuelTypes,
                transmissions,
                priceRange,
            }
        })

    } catch (err) {
        const error = new Error("Error fetching car filters :" + err.message);
        next(error);
    }
});

export const getCars = asyncHandler(async (req, res, next) => {
    const {
        search = "",
        make = "",
        bodyType = "",
        fuelType = "",
        transmission = "",
        minPrice = 0,
        maxPrice = Number.MAX_SAFE_INTEGER,
        sortBy = "newest",  //newest | priceAsc | priceDesc
        page = 1,
        limit = 6
    } = req.query;
    // req.query me sab kuch string hota hai, even numbers.

    const clerkId = req?.auth?.userId;

    try {
        // console.log("phuchi yha tak");
        const keyword = {
            status: "AVAILABLE"
        }

        if (search) {
            keyword.$or = [
                { make: { $regex: search, $options: "i" } },
                { model: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ]
        }

        if (make) {
            keyword.make = {
                $regex: `^${make}$`, $options: "i"
                // ^ => string yahin se start honi chahiye
                // $ => string yahin pe end honi chahiye
            }
        }

        if (bodyType) {
            keyword.bodyType = {
                $regex: `^${bodyType}$`, $options: "i"
            }
        }

        if (fuelType) keyword.fuelType = { $regex: `^${fuelType}$`, $options: "i" };
        if (transmission) keyword.transmission = { $regex: `^${transmission}$`, $options: "i" };

        keyword.price = {
            $gte: Number(minPrice) || 0
            // req.query req.query ke saare values STRING hote hain, chahe tum frontend se number bhejo.
        }
        // ab me direct keyword.price $lte ki condition laga deta to ye overwirte ho jata 

        if (maxPrice && maxPrice < Number.MAX_SAFE_INTEGER) {
            keyword.price.$lte = Number(maxPrice)
        }

        const pageNumber = Number(page);
        const pageSize = Number(limit);
        const skip = (pageNumber - 1) * pageSize;

        const sort = {};
        if (sortBy === "priceAsc") sort.price = 1;
        else if (sortBy === "priceDesc") sort.price = -1;
        else sort.createdAt = -1;

        const totalCars = await Car.countDocuments(keyword);

        const cars = await Car.find(keyword).sort(sort).skip(skip).limit(pageSize);

        const user = await User.findOne({ clerkUserId: clerkId });

        let wishListed = new Set();

        if (user) {
            const savedCars = await UserSavedCar.find({ userId: user._id });

            wishListed = new Set(savedCars?.map((saved) => saved.carId.toString()));
        }
        // console.log(wishListed)

        const serializedCars = cars.map((car) => {
            // console.log(car._id)
            // if (wishListed.has(car._id.toString())) console.log("mil gaya");
            return serializeCarData(car._doc, wishListed.has(car._id.toString()));
        })

        // console.log(serializedCars);

        return res.status(200).json({
            serializedCars,
            totalCars,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalCars / pageSize)
        })
    } catch (err) {
        const error = new Error("Error fetching cars" + err.message);
        next(err);
    }
})

// export const getCarsForChatBot = asyncHandler(async (req, res, next) => {
//     const {
//         search = "",
//         make = "",
//         bodyType = "",
//         fuelType = "",
//         transmission = "",
//         minPrice = 0,
//         maxPrice = Number.MAX_SAFE_INTEGER,
//         sortBy = "newest",  //newest | priceAsc | priceDesc
//         page = 1,
//         limit = 6
//     } = req.query;
//     // req.query me sab kuch string hota hai, even numbers.

//     // const clerkId = req?.auth?.userId;

//     try {
//         // console.log("phuchi yha tak");
//         const keyword = {
//             status: "AVAILABLE"
//         }

//         if (search && search !== "None") {
//             keyword.$or = [
//                 { make: { $regex: search, $options: "i" } },
//                 { model: { $regex: search, $options: "i" } },
//                 { description: { $regex: search, $options: "i" } }
//             ]
//         }

//         if (make && make !== "None") {
//             keyword.make = {
//                 $regex: `^${make}$`, $options: "i"
//                 // ^ => string yahin se start honi chahiye
//                 // $ => string yahin pe end honi chahiye
//             }
//         }

//         if (bodyType && bodyType !== "None") {
//             keyword.bodyType = {
//                 $regex: `^${bodyType}$`, $options: "i"
//             }
//         }

//         if (fuelType && fuelType !== "None") keyword.fuelType = { $regex: `^${fuelType}$`, $options: "i" };
//         if (transmission && transmission !== "None") keyword.transmission = { $regex: `^${transmission}$`, $options: "i" };

//         if (minPrice !== "None") {
//             keyword.price = {
//                 $gte: Number(minPrice) || 0
//                 // req.query req.query ke saare values STRING hote hain, chahe tum frontend se number bhejo.
//             }
//         }
//         // ab me direct keyword.price $lte ki condition laga deta to ye overwirte ho jata 

//         if (maxPrice && maxPrice!=="None" && maxPrice < Number.MAX_SAFE_INTEGER) {
//             keyword.price.$lte = Number(maxPrice)
//         }

//         const pageNumber = Number(page);
//         const pageSize = Number(limit);
//         const skip = (pageNumber - 1) * pageSize;

//         const sort = {};
//         if (sortBy === "priceAsc") sort.price = 1;
//         else if (sortBy === "priceDesc") sort.price = -1;
//         else sort.createdAt = -1;

//         const totalCars = await Car.countDocuments(keyword);

//         console.log("backend ", keyword)
//         const cars = await Car.find(keyword).sort(sort).skip(skip).limit(pageSize);

//         // const user = await User.findOne({ clerkUserId: clerkId });
//         console.log("backend ", cars)
//         let wishListed = new Set();

//         // if (user) {
//         //     const savedCars = await UserSavedCar.find({ userId: user._id });

//         //     wishListed = new Set(savedCars?.map((saved) => saved.carId.toString()));
//         // }
//         // console.log(wishListed)

//         const serializedCars = cars.map((car) => {
//             // console.log(car._id)
//             // if (wishListed.has(car._id.toString())) console.log("mil gaya");
//             return serializeCarData(car._doc, wishListed.has(car._id.toString()));
//         })

//         // console.log(serializedCars);

//         return res.status(200).json({
//             serializedCars
//         })
//     } catch (err) {
//         const error = new Error("Error fetching cars" + err.message);
//         next(err);
//     }
// })

export const getCarsForChatBot = asyncHandler(async (req, res, next) => {
    const {
        search = "",
        make = "",
        bodyType = "",
        fuelType = "",
        transmission = "",
        minPrice = 0,
        maxPrice = Number.MAX_SAFE_INTEGER,
        sortBy = "newest",
        page = 1,
        limit = 6
    } = req.query;

    try {
        // console.log(req.query)
        let keyword = {
            status: "AVAILABLE"
        };

        if (search && search !== "None") {
            keyword.$or = [
                { make: { $regex: search, $options: "i" } },
                { model: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        } else {
            // 🔥 APPLY FILTERS ONLY IF SEARCH NOT PRESENT

            if (make && make !== "None") {
                keyword.make = { $regex: make, $options: "i" };
            }

            if (bodyType && bodyType !== "None") {
                keyword.bodyType = { $regex: bodyType, $options: "i" };
            }

            if (fuelType && fuelType !== "None") {
                keyword.fuelType = { $regex: fuelType, $options: "i" };
            }

            if (transmission && transmission !== "None") {
                keyword.transmission = { $regex: transmission, $options: "i" };
            }
        }

        keyword.price = {
            $gte: Number(minPrice) || 0
        };

        if (
            maxPrice &&
            maxPrice !== "None" &&
            Number(maxPrice) < Number.MAX_SAFE_INTEGER
        ) {
            keyword.price.$lte = Number(maxPrice);
        }

        const pageNumber = Number(page);
        const pageSize = Number(limit);
        const skip = (pageNumber - 1) * pageSize;

        const sort = {};
        if (sortBy === "priceAsc") sort.price = 1;
        else if (sortBy === "priceDesc") sort.price = -1;
        else sort.createdAt = -1;

        // console.log("FINAL QUERY:", keyword , keyword["$or"][0].make);

        const totalCars = await Car.countDocuments(keyword);

        const cars = await Car.find(keyword)
            .sort(sort)
            .skip(skip)
            .limit(pageSize);

        const serializedCars = cars.map((car) => {
            return serializeCarData(car._doc, false);
        });

        return res.status(200).json({
            totalCars,
            cars: serializedCars
        });

    } catch (err) {
        const error = new Error("Error fetching cars " + err.message);
        next(error);
    }
});


export const toggleSavedCar = asyncHandler(async (req, res, next) => {
    const { id } = req.query;
    const clerkId = req?.auth?.userId;

    try {
        const car = await Car.findById(id);

        if (!car) {
            throw new Error("Car not found");
        }

        const user = await User.findOne({ clerkUserId: clerkId });

        const existingSave = await UserSavedCar.findOne({
            userId: user._id,
            carId: id
        })

        let mssg = "";

        if (existingSave) {
            await UserSavedCar.deleteOne({
                userId: user._id,
                carId: id
            })
            mssg += "Car removed from favourites";
        }
        else {
            await UserSavedCar.create({
                userId: user._id,
                carId: id,
            })
            mssg += "Car added to favourites";
        }

        return res.status(200).send(mssg);

    } catch (err) {
        const error = new Error("Error toggling saved car: " + err.message);
        next(error);
    }
});

export const getSavedCars = asyncHandler(async (req, res, next) => {
    try {
        const clerkId = req?.auth?.userId;

        const user = await User.findOne({ clerkUserId: clerkId });

        const allCars = await UserSavedCar.find({ userId: user._id }).populate("carId").lean().sort({ createdAt: -1 });
        // _doc internal hota hai, isliye directly visible nahi hota
        // lean() function use karne ke bad carId already plain JS object hoga , _doc kabhi aayega hi nahi

        // console.log(allCars);

        const serializedCars = allCars.map((car) => {
            return serializeCarData(car?.carId, true);
        })

        // console.log(serializedCars);

        res.send(serializedCars);
    } catch (err) {
        const error = new Error("Error fetching saved cars" + err.message);
        next(error);
    }
})

export const getCarById = asyncHandler(async (req, res, next) => {
    const id = req.query?.id;
    const clerkId = req?.auth?.userId;

    if (!id) {
        const err = new Error("Please select a valid car to view");
        err.status = 400;
        throw err;
    }

    try {
        const car = await Car.findById(id).lean();
        // Anything that returns a Mongoose document (findOne, find, findById, populate) has _doc internally.

        if (!car) {
            const err = new Error("Car not found");
            throw err;
        }

        const user = await User.findOne({ clerkUserId: clerkId });
        let wishListed = false;
        let userTestDrive = null;

        if (user) {
            const isSavedCar = await UserSavedCar.findOne(
                {
                    userId: user._id,
                    carId: id
                }
            );


            if (isSavedCar) {
                wishListed = true;
            }
        }

        const existingTestDrive = await TestDriveBooking.findOne({
            carId: id,
            userId: user._id,
            status: { $in: ["CONFIRMED", "PENDING", "COMPLETED"] }
        }).lean().sort({ createdAt: -1 });

        if (existingTestDrive) {
            userTestDrive = existingTestDrive;
        }

        const dealerShip = await DealershipInfo.findOne({}).lean();

        const serializedCar = {
            ...serializeCarData(car, wishListed),
            testDriveInfo: {
                userTestDrive,
                dealerShip: dealerShip ? {
                    ...dealerShip,
                    createdAt: dealerShip.createdAt.toISOString(),
                    updatedAt: dealerShip.updatedAt.toISOString(),
                    workingHours: dealerShip.workingHours
                } : null,
            }
        };

        res.send(serializedCar);

    } catch (err) {
        const error = new Error("Error catching car details: " + err.message);
        next(error);
    }
})

export const getCarForTestDrive = asyncHandler(async (req, res, next) => {
    const id = req.query?.id;
    const clerkId = req?.auth?.userId;

    if (!id) {
        const err = new Error("Please select a valid car to view");
        err.status = 400;
        throw err;
    }

    try {
        const car = await Car.findById(id).lean();
        // Anything that returns a Mongoose document (findOne, find, findById, populate) has _doc internally.

        if (!car) {
            const err = new Error("Car not found");
            throw err;
        }

        const user = await User.findOne({ clerkUserId: clerkId });
        let wishListed = false;
        let userTestDrive = null;

        if (user) {
            const isSavedCar = await UserSavedCar.findOne(
                {
                    userId: user._id,
                    carId: id
                }
            );


            if (isSavedCar) {
                wishListed = true;
            }
        }

        const existingTestDrive = await TestDriveBooking.find({
            carId: id,
            status: { $in: ["CONFIRMED", "PENDING", "COMPLETED"] }
        }).lean().sort({ createdAt: -1 });

        if (existingTestDrive) {
            userTestDrive = existingTestDrive;
        }

        const dealerShip = await DealershipInfo.findOne({}).lean();

        const serializedCar = {
            ...serializeCarData(car, wishListed),
            testDriveInfo: {
                userTestDrive,
                dealerShip: dealerShip ? {
                    ...dealerShip,
                    createdAt: dealerShip.createdAt.toISOString(),
                    updatedAt: dealerShip.updatedAt.toISOString(),
                    workingHours: dealerShip.workingHours
                } : null,
            }
        };

        res.send(serializedCar);

    } catch (err) {
        const error = new Error("Error catching car details: " + err.message);
        next(error);
    }
})

export const getCarForTestDriveChatBot = asyncHandler(async (req, res, next) => {
    const id = req.query?.id;
    const clerkId = req?.auth?.userId;
    // console.log("slots backend i/p " , id)
    if (!id) {
        const err = new Error("Please select a valid car to view");
        err.status = 400;
        throw err;
    }

    try {
        const car = await Car.findById(new mongoose.Types.ObjectId(id)).lean();
        // Anything that returns a Mongoose document (findOne, find, findById, populate) has _doc internally.

        if (!car) {
            const err = new Error("Car not found");
            throw err;
        }

        // const user = await User.findOne({ clerkUserId: clerkId });
        let wishListed = false;
        let userTestDrive = null;

        // if (user) {
        //     const isSavedCar = await UserSavedCar.findOne(
        //         {
        //             userId: user._id,
        //             carId: id
        //         }
        //     );


        //     if (isSavedCar) {
        //         wishListed = true;
        //     }
        // }

        const existingTestDrive = await TestDriveBooking.find({
            carId: new mongoose.Types.ObjectId(id),
            status: { $in: ["CONFIRMED", "PENDING", "COMPLETED"] }
        }).lean().sort({ createdAt: -1 });

        // console.log("slots Backend o/p " , existingTestDrive)
        if (existingTestDrive) {
            userTestDrive = existingTestDrive;
        }

        // const dealerShip = await DealershipInfo.findOne({}).lean();


        res.send(userTestDrive);

    } catch (err) {
        const error = new Error("Error catching car details: " + err.message);
        next(error);
    }
})