import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
    make : {
        type : String ,
        required : true 
    } ,
    model : {
        type : String ,
        required : true 
    } ,
    year : {
        type : Number ,
        required : true ,
        index : true 
    } ,
    price : {
        type : mongoose.Schema.Types.Decimal128,
        required : true ,
        index : true 
    } ,
    mileage : {
        type : Number ,
        required : true 
    },
    color : {
        type : String ,
        required : true 
    },
    fuelType : {
        type: String ,
        required : true ,
        index : true 
    },
    transmission : {
        type : String ,
        required : true 
    },
    bodyType : {
        type : String ,
        required : true ,
        index : true 
    },
    seats : {
        type : Number ,
    } ,
    description : {
        type : String ,
        required : true 
    },
    status : {
        type : String ,
        enum : ["AVAILABLE" , "UNAVAILABLE" , "SOLD"] ,
        default : "AVAILABLE" ,
        index : true 
    } ,
    featured : {
        type : Boolean ,
        default : false ,
        index : true 
    } ,
    images : [{
        url : String ,
        publicId : String 
    }] ,
    savedBy : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "UserSavedCar"
        }
    ] ,
    testDriveBookings : [{
        type : mongoose.Schema.Types.ObjectId ,
        ref : "TestDriveBooking"
    }],
} , {timestamps : true});

carSchema.index({make : 1 , model : 1});


const Car = mongoose.model("Car" , carSchema);

export default Car ;