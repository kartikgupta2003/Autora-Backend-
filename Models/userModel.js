import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkUserId : {
        type : String ,
        required : true,
        unique:true
    } ,
    name : {
        type : String ,
    } ,
    email : {
        type : String ,
        required : true ,
        unique : true ,
    } ,
    imageUrl : {
        type : String 
    }  ,  
    role : {
        type : String ,
        enum : ["USER" , "ADMIN"] ,
        default : "USER"
    } ,
    savedCars : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "UserSavedCar"
        }
    ] ,
    testDrives : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "TestDriveBooking"
        }
    ] ,
    uploaded_docs : [
        {
            doc_name : {
                type : String ,
                required : true 
            } ,
            doc_hash : {
                type : String ,
                required : true ,
                // unique : true 
            } ,
            doc_size : {
                type : Number 
            } 
        }
    ]

} , {timestamps : true});

const User = mongoose.model("User" , userSchema);

export default User ;