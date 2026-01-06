const errorHandler = (err ,req,res , next) =>{
    const message = err.message || "Something went wrong!" ;
    const status = err.statusCode || err.status || 500;

    // console.log(err.message);

    res.status(status);

    return res.send({"message" : message});
}

export default errorHandler;