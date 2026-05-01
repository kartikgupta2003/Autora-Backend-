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
    }
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;