export const serializeCarData = (car , wishListed=false)=>{
    return(
        {
            ...car ,
            price : car.price ? parseFloat(car.price.toString()) : 0 ,
            wishListed : wishListed
        }
    )
}