import mongoose from "mongoose";

const testDriveBookingSchema = new mongoose.Schema({
    carId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Car",
        required : true ,
        index : true 
    } ,
    userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User",
        required : true ,
        index : true 
    } ,
    bookingDate : {
        type : Date , 
        default : Date.now ,
        required : true ,
        index : true 
    } ,
    startTime : {    //HH:MM
        type : String ,
        required : true ,
    } ,
    endTime : {    //HH:MM
        type : String ,
        required : true ,
    } ,
    status : {
        type : String ,
        enum : ["PENDING" , "CONFIRMED" , "COMPLETED" , "CANCELLED" , "NO_SHOW"] ,
        default : "PENDING",
        required : true ,
        index : true  
    } ,
    notes : {
        type : String 
    } ,
} , {timestamps : true});

testDriveBookingSchema.index({userId : 1 , carId : 1} , {unique : true})
// In MongoDB, a unique constraint on multiple fields ALWAYS creates an index.

const TestDriveBooking = mongoose.model("TestDriveBooking" , testDriveBookingSchema);

export default TestDriveBooking ;