const chatbotMiddleware = async(req , res , next)=>{
    const key = req.headers["service-key"]

    if(key !== process.env.CHATBOT_SERVICE_KEY){
        return res.status(403).json({message : "Unauthorized service"})
    }

    next();
}

export default chatbotMiddleware;