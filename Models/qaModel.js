import mongoose from "mongoose";
import User from "./userModel.js";

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    } ,
    thread_id : {
        type : String ,
        required : true ,
        unique : true 
    } ,
    thread_name : {
        type : String ,
        required : true 
    },
    active_doc_hash : {
        type : String 
    } ,
    active_doc_name : {
        type : String 
    }
}, { timestamps: true });

const QAChat = mongoose.model("QAChat", chatSchema);

export default QAChat;