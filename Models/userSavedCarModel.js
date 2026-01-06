import mongoose from "mongoose";

const userSavedCarSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User" ,
        required : true ,
        index : true 
    } ,
    carId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Car",
        required : true ,
        index : true 
    } ,
    savedAt : {
        type : Date , 
        default : Date.now
    }
} , {timestamps : true});

userSavedCarSchema.index({userId : 1 , carId : 1} , {unique : true})
// In MongoDB, a unique constraint on multiple fields ALWAYS creates an index.

const UserSavedCar = mongoose.model("UserSavedCar" , userSavedCarSchema);

export default UserSavedCar ;