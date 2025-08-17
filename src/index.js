import dotenv from "dotenv"
import connectDB from "./db/connection.js"
import {app} from "./app.js"

dotenv.config({
    path:"./.env"
})

//starting the server here
//connecting to the database
connectDB().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`server is running on port ${process.env.PORT}`)
    })
}).catch((err)=>{
    console.log("connection failed",err)
})
//since its a promise returned by connectDB method(async await function), 
//we can use then and catch to handle the promise 

