import User from "../Models/userModel.js";
export const uploadDoc = async(req,res,next)=>{
    const clerkId = req?.auth?.userId;
    const {doc_hash , doc_name , doc_size} = req.body ;
    // console.log("doc " , req.body);
    try{
        const user = await User.findOne({clerkUserId : clerkId}) ;
        // console.log("doc " , req.body);
        if(!user){
            const err = new Error("User not found");
            throw err;
        }

        let existingDoc;
        
        if(user?.uploaded_docs && user?.uploaded_docs.length > 0){
            for (let i=0 ; i<user.uploaded_docs.length ; i++){
                if(user.uploaded_docs[i].doc_hash === doc_hash){
                    existingDoc = user.uploaded_docs[i];
                    break;
                }
            }
        }

        if(existingDoc){
            return res.json({"already_uploaded" : true});
        }

        const doc = {
            "doc_name" : doc_name ,
            "doc_hash" : doc_hash ,
            "doc_size" : doc_size
        }
        // console.log(doc);
        await User.findByIdAndUpdate(user._id , { $push : {uploaded_docs : doc}});
        
        return res.send({"already_uploaded" : false});

    }catch(err){
        const error = new Error("error uploading pdf " + err.message);
        next(error);
    }
}

export const deleteDoc = async(req,res,next)=>{
    const clerkId = req?.auth?.userId ;
    const {doc_hash} = req.body ;
    try{
        const user = await User.findOne({clerkUserId : clerkId});
        if(!user){
            const error = new Error("User not found");
            throw error ;
        }
        let existingDoc ;
        if(user?.uploaded_docs && user?.uploaded_docs?.length > 0){
            for(let i=0 ; i<user.uploaded_docs.length ; i++){
                if(user.uploaded_docs[i].doc_hash === doc_hash){
                    existingDoc = user.uploaded_docs[i];
                    break;
                }
            }
        }
        if(!existingDoc){
            const error = new Error("Document not found");
            throw error ;
        }
        await User.findByIdAndUpdate(user._id , {
            $pull : {
                 uploaded_docs : {doc_hash : doc_hash}
            }
        })

        return res.send("Document deleted successfully");
    }catch(err){
        const error = new Error("Error deleting document " + err.message);
        next(err);
    }
}