import User from "../Models/userModel.js";
import Chat from "../Models/chatModel.js";

export const fetchAllChats = async(req,res,next)=>{
    const clerkId = req?.auth?.userId;
    try{
        const user = await User.findOne({clerkUserId : clerkId}) ;

        if(!user){
            const err = new Error("User not found");
            throw err;
        }

        const chats = await Chat.find({userId : user._id}).sort({updatedAt : -1}).lean();

        const formattedChats = chats.map((chat)=>{
            return({
                id : chat.thread_id ,
                name : chat.thread_name
            })
        })

        return res.json(formattedChats);

    }catch(err){
        const error = new Error("Error fetching chats " + err.message);
        next(error);
    }
}

export const addNewChat = async(req,res,next)=>{
    const clerkId = req?.auth?.userId;
    const {thread_id , thread_name} = req.body ;
    try{
        if(!thread_id || !thread_name){
            throw new Error("Invalid thread id or name");
        }

        const user = await User.findOne({clerkUserId : clerkId}) ;

        if(!user){
            const err = new Error("User not found");
            throw err;
        }

        const existingChat = await Chat.findOne({userId : user._id , thread_id : thread_id});

        if(existingChat){
            const err = new Error("Chat with this thread_id already exists");
            throw err;
        }

        const chat = await Chat.create({userId : user._id , thread_id : thread_id , thread_name :thread_name})

        return res.status(201).json(chat);

    }catch(err){
        const error = new Error("Error creating chat " + err.message);
        next(error);
    }
}