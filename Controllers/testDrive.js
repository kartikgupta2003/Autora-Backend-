import expressAsyncHandler from "express-async-handler";
import Car from "../Models/carModel.js";
import TestDriveBooking from "../Models/testDriveBookingModel.js";
import User from "../Models/userModel.js";
import { serializeCarData } from "./helper.js";

export const bookTestDrive = expressAsyncHandler(async(req,res,next)=>{
    const {carId , bookingDate , startTime , endTime , notes} = req.body;
    const clerkId = req?.auth?.userId;

    try{
        const car = await Car.findOne({
            _id : carId ,
            status : "AVAILABLE"
        });

        const user = await User.findOne({
            clerkUserId : clerkId
        })

        if(!user){
            throw new Error("User not found");
        }

        if(!car){
            throw new Error("Car not available for test drive");
        }

        // MongoDB me Date exact timestamp se match hoti hai.
        // Agar DB me date stored hai: 2025-01-02T00:00:00.000Z and Aur frontend se aayi: 2025-01-02T05:30:00.000Z
        // Match fail ho jayega, even though same calendar date hai.

        const date = new Date(bookingDate);
        const startOfDay = new Date(date.setHours(0,0,0,0));
        const endOfDay = new Date(date.setHours(23,59,59,999));

        const existingBooking = await TestDriveBooking.findOne({
            carId : carId ,
            bookingDate : {$gte : startOfDay , $lte : endOfDay},
            // req.body me date hamesha string hi aati hai
            // (JSON parser date ko Date object me convert nahi karta)
            startTime ,
            status : {$in : ["PENDING" , "CONFIRMED"]}
        });

        if(existingBooking){
            throw new Error("This time slot is already booked. Please select another time.");
        }

        const booking = await TestDriveBooking.create({
            carId ,
            userId : user._id ,
            bookingDate : new Date(bookingDate) ,
            startTime ,
            endTime ,
            notes : notes || null ,
            status : "PENDING"
        });

        return res.send(booking);

    }catch(err){
        const error = new Error("Error booking test drive " + err.message);
        next(error);
    }
});

export const getUserTestDrives = expressAsyncHandler(async(req,res,next)=>{
    const clerkId = req?.auth?.userId;

    try{
        const user = await User.findOne({
            clerkUserId : clerkId
        })

        if(!user){
            throw new Error("User not found");
        }

        const bookings = await TestDriveBooking.find({
            userId : user._id 
        }).populate("carId").lean().sort({bookingDate : -1});

        const formatedBookings = bookings.map((booking)=>{
            return(
                {
                    id : booking._id ,
                    carId : booking.carId._id ,
                    car : serializeCarData(booking.carId) ,
                    bookingDate : booking.bookingDate.toISOString() ,
                    startTime : booking.startTime ,
                    endTime : booking.endTime ,
                    status : booking.status ,
                    notes : booking.notes ,
                    createdAt : booking.createdAt.toISOString() ,
                    updatedAt : booking.updatedAt.toISOString()
                }
            );
        });

        res.send(formatedBookings);

    }catch(err){
        const error = new Error("Error fetching test drives " + err.message);
        next(error);
    }

});

export const cancelTestDrive = expressAsyncHandler(async(req,res,next)=>{
    const clerkId = req?.auth?.userId;
    const id = req?.query?.id;

    try{
        const user = await User.findOne({
            clerkUserId : clerkId
        })

        if(!user){
            throw new Error("User not found");
        }

        // console.log("user hai " , user);
        const booking = await TestDriveBooking.findById(id);
        // console.log("booking hai " , booking);

        if(!booking){
            throw new Error("Booking not found");
        }

        if(booking.userId.toString() !== user._id.toString() && user.role !== "ADMIN"){
            throw new Error("Unauthorized to cancel this booking");
        }
        
        if(booking.status === "CANCELLED"){
            throw new Error("Booking is already cancelled");
        }
        
        if(booking.status === "COMPLETED"){
            throw new Error("Cannot cancel a completed booking");
        }

        await TestDriveBooking.findByIdAndUpdate(id , {
            $set : {status : "CANCELLED"}
        });

        return res.status(200).json({message : "Test drive cancelled successfully"});

    }catch(err){
        const error = new Error("Error cancelling test drive: " + err.message);
        next(error);
    }
} );