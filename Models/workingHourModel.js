import mongoose from "mongoose";

const workingHourSchema = new mongoose.Schema({
    dealerShipId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "DealershipInfo" ,
        required : true ,
        index : true 
    } ,
    dayOfWeek : {
        type : String ,
        enum : ["MONDAY" , "TUESDAY" , "WEDNESDAY" , "THURSDAY" , "FRIDAY" , "SATURDAY" , "SUNDAY"] ,
        required : true ,
        index : true 
    },
    openTime : {      // HH:MM
        type : String ,
        required : true 
    } ,
    closeTime : {    // HH:MM
        type : String ,
        required : true 
    } ,
    isOpen : {
        type : Boolean ,
        default : true ,
        index : true 
    }

} , {timestamps : true});

const WorkingHour = mongoose.model("WorkingHour" , workingHourSchema);

export default WorkingHour ;