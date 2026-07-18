import QAChat from "../Models/qaModel.js";
import User from "../Models/userModel.js";

export const fetchAllChats = async(req,res,next)=>{
    const clerkId = req?.auth?.userId;
    try{
        const user = await User.findOne({clerkUserId : clerkId}) ;

        if(!user){
            const err = new Error("User not found");
            throw err;
        }

        const chats = await QAChat.find({userId : user._id}).sort({updatedAt : -1}).lean();

        const formattedChats = chats.map((chat)=>{
            return({
                id : chat.thread_id ,
                name : chat.thread_name ,
                active_doc_hash : chat.active_doc_hash ,
                active_doc_name : chat.active_doc_name
            })
        })

        return res.json(formattedChats);

    }catch(err){
        const error = new Error("Error fetching chats " + err.message);
        next(error);
    }
}

export const updateActiveDoc = async(req,res,next)=>{
    try{
        console.log("update hone aya ");
        const clerkId = req?.auth?.userId;
        const user = await User.findOne({clerkUserId : clerkId});
        if(!user){
            const error = new Error("User not found!");
            throw error ;
        }
        const {active_doc_hash , active_doc_name , thread_id} = req.body ;
        console.log("update hone aya " , active_doc_hash , active_doc_name);
        const updatedDoc = await QAChat.findOneAndUpdate({userId : user._id , thread_id : thread_id} , {$set : {active_doc_hash : active_doc_hash , active_doc_name : active_doc_name}} , {new : true});
        if(!updatedDoc){
            const error = new Error("Thread not found");
            throw error ;
        }
        return res.send("Active Doc updated successfully");
    }catch(err){
        console.log(err);
        next(err);
    }
}

export const addNewChat = async(req,res,next)=>{
    const clerkId = req?.auth?.userId;
    const {thread_id, thread_name} = req.body ;
    try{
        console.log("thread " , thread_id , thread_name);
        if(!thread_id || !thread_name){
            const error = new Error("Invalid thread id or name !");
            throw error ;
        }
        const user = await User.findOne({clerkUserId : clerkId});
        if(!user){
            const error = new Error("User not found !");
            throw(error);
        }
        
        const existingThread =await  QAChat.findOne({userId : user._id , thread_id : thread_id}) ;
        console.log("existing thread " , existingThread);
        if(existingThread){
            const error = new Error("Chat with this thread_id already exists");
            throw error ;
        }

        const new_chat = await QAChat.create({
            userId : user._id ,
            thread_id : thread_id ,
            thread_name : thread_name 
        });
        console.log("new thread " , new_chat);
        return res.status(201).send(new_chat);
    }catch(err){
        console.log(err);
        next(err);
    }
}