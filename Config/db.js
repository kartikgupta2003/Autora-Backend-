import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        const url = process.env.MONGO_URI;
        await mongoose.connect(url);
        //("MongoDB connected");
    }
    catch(err){
        //(`Error ${err}`);
        process.exit(1);
    }
}

export default connectDB;