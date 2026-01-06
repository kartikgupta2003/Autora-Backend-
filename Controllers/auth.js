import asyncHandler from "express-async-handler";
import User from "../Models/userModel.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const handleLogin = asyncHandler(async (req, res, next) => {
    const { name, email, clerkUserId, imageUrl} = req.body;

    // console.log("handle login tak phucha " , name , email, clerkUserId, imageUrl);

    if ((!name) || (!email) || (!clerkUserId) || (!imageUrl)) {
        // console.log("babu kya nhi aya !");
        throw (new Error);
    }

    try {
        let existingUser = await User.findOne({ email });

        if (!existingUser) {
            existingUser = await User.create({
                name,
                email,
                clerkUserId,
                imageUrl,
            })
        }

        return res.send(existingUser);
    } catch (err) {
        // console.log("babu kya nhi aya !");
        // console.log("error ki ma ka bhaosada " , err)
        const error = new Error("User authentication failed !");
        error.status = 500;
        next(error);
    }

})

export const checkAdmin = asyncHandler(async(req,res) =>{
    const clerkUserId = req?.auth?.userId;

    // console.log("id hai " , clerkUserId);


    const user = await User.findOne({clerkUserId});
    // console.log(user.role);

    if((!user) || (user.role !== 'ADMIN')){
        // console.log("user " , user.role);
        return res.status(403).json({message : "Access denied"});
    }

    return res.json({message : "ok"});
})

// module.exports = {
//     handleLogin ,
//     checkAdmin
// };