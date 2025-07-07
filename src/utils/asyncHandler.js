const asyncHandler=(requestHandler)=>{
    return async(req,res,next)=>{
        try{
            await requestHandler(req,res,next)
        }catch(err){
           next(err)
           //we pass the error to next middleware, usually global error handler 
        }
    }

}

export {asyncHandler}



// catch(err){
//             res.status(err.code || 500).json({
//                 status:false,
//                 message:err.message
//             })
//             it’s better to pass the error to the global handler instead of sending the response directly from here. 
//             next(err)
//         }