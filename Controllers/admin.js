import expressAsyncHandler from "express-async-handler";
import TestDriveBooking from "../Models/testDriveBookingModel.js";
import Car from "../Models/carModel.js";
import User from "../Models/userModel.js";
import {serializeCarData} from "./helper.js";

export const getAdminTestDrives = expressAsyncHandler(async(req, res, next) => {
    const search = req?.query?.search || "";
    const status = req?.query?.status || "";

    let where = {};
    try {
        if (status) {
            where.status = status;
        }

        if (search) {
            const carIds = await Car.find({
                $or: [
                    { make: { $regex: search, $options: "i" } },
                    { model: { $regex: search, $options: "i" } }
                ]
            }).select("_id");

            const userIds = await User.find({
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            }).select("_id");

            where.$or = [
                { userId: { $in: userIds.map((c) => c._id) } },
                { carId: { $in: carIds.map((u) => u._id) } }
            ];

        }

        const testDrives = await TestDriveBooking.find(where).populate("userId" , "_id  name email imageUrl phone").populate("carId").lean().sort({ bookingDate: -1, startTime: 1 });


        // console.log("test drives are" , testDrives);

        // yha pe carIds and userIds thi testDrive DB me na ki actual documents isliye humne query ko 2 step me lagaya 
        // Then carIds and userIds arrays h but uske elements objects hai like { _id: ObjectId("65a1...") } so taki hum uspe in operator laga paye hume pure array chahiye thi jiske elements ho [ObjectId("65a1"), ObjectId("65a2")]
        // so isliye humne map lagake kewal ids fill kardi array me 

        const formatedBookings = testDrives.map((test) => {
            return (
                {
                    id: test._id,
                    carId: test.carId._id,
                    car: serializeCarData(test.carId) ,
                    user : test.userId ,
                    bookingDate : test.bookingDate.toISOString() ,
                    startTime : test.startTime ,
                    endTime : test.endTime ,
                    status : test.status ,
                    notes : test.notes 
                }
            )
        });

        res.send(formatedBookings);
    } catch (err) {
        const error = new Error("Error fetching test drives: " + err.message);
        next(error);
    }
})

export const updateTestDriveStatus = expressAsyncHandler(async (req,res,next) => {
    const bookingId = req?.query?.id ;
    const newStatus = req?.query?.status ;

    try{

        const booking = await TestDriveBooking.findById(bookingId);

        if(!booking){
            throw new Error("Booking not found");
        }

        const validStatuses = [
            "PENDING" ,
            "CONFIRMED",
            "COMPLETED",
            "CANCELLED",
            "NO_SHOW"
        ];

        if(!validStatuses.includes(newStatus)){
            throw new Error("Invalid status");
        }

        await TestDriveBooking.findByIdAndUpdate(bookingId , {
            $set : {status : newStatus}
        });

        res.send({message : "Test drive status updated successfully"});

    }catch(err){
        const error = new Error("Error updating test drive status: " + err.message);
        next(error);
    }
})

export const getDashBoardData = expressAsyncHandler(async(req,res,next)=>{
    try{
        // car statistics
        const totalCars = await Car.countDocuments();
        const availableCars = await Car.countDocuments({status : "AVAILABLE"});
        const soldCars = await Car.countDocuments({status : "SOLD"});
        const unavailableCars = await Car.countDocuments({status : "UNAVAILABLE"});
        const featuredCars = await Car.countDocuments({featured : true});
        
        // test drive statistics 
        const totalTestDrives = await TestDriveBooking.countDocuments();
        const pendingTestDrives = await TestDriveBooking.countDocuments({status : "PENDING"});
        const confirmedTestDrives = await TestDriveBooking.countDocuments({status : "CONFIRMED"});
        const completedTestDrives = await TestDriveBooking.countDocuments({status : "COMPLETED"});
        const cancelledTestDrives = await TestDriveBooking.countDocuments({status : "CANCELLED"});
        const noShowTestDrives = await TestDriveBooking.countDocuments({status : "NO_SHOW"});

        // Calculate test drive conversion rate (completed test drives that led to sales)
        const completedTestDriveCarIds = await TestDriveBooking.find({
            status : "COMPLETED"
        }).select("carId");
        const soldCarsAfterTestDrive = await Car.countDocuments({
            _id : {$in : completedTestDriveCarIds.map((c)=> c._id)} ,
            status : "SOLD"
        })
        const conversionRate = completedTestDrives > 0 ? (soldCarsAfterTestDrive / completedTestDrives) * 100 : 0 ;
        
        res.send(
            {
                cars : {
                    total : totalCars ,
                    available : availableCars ,
                    sold : soldCars ,
                    unavailable : unavailableCars ,
                    featured : featuredCars
                } ,
                testDrives : {
                    total : totalTestDrives ,
                    pending : pendingTestDrives ,
                    confirmed : confirmedTestDrives ,
                    completed : completedTestDrives ,
                    cancelled : cancelledTestDrives ,
                    noShow : noShowTestDrives ,
                    conversionRate : parseFloat(conversionRate.toFixed(2))
                }
            }
        )
    }catch(err){
        // console.log(err);
        const error = new Error("Error fetching dashboard data: " + err.message);
        next(error);
    }
});