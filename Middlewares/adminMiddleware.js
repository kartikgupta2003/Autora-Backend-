import User from "../Models/userModel.js";

const authAdmin = async(req,res,next)=>{
    const clerkId = req?.auth?.userId;

    try{
        const user = await User.findOne({clerkUserId : clerkId});

        if(!user || user.role!="ADMIN"){
            const error = new Error("Unauthorized");
            error.status=403;
            throw error;
        }

        next();

    }catch(err){
        next(err);
    }
    
}

export default authAdmin;