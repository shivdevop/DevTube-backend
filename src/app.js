import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {errorHandler} from "./utils/errorHandler.js"

const app=express()

app.use(cors(
    {
        origin:process.env.CORS_ORIGIN
    }
))

//basically the below middlewares we are writing to convey express what data we are accepting
app.use(express.json({
    limit:"16kb"
}))
//no need to use bodyParser,express.json() is fine 
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
//what this does is, it will allow us to access the static files in public folder 

app.use(cookieParser())

//router import 
import userRouter from "./routes/user.routes.js"

//routes declaration

//router ke liye hume middleware ki need hai, so we will use app.use()
app.use("/api/v1/users",userRouter)
// /api/v1/users is like a prefix for all the routes in userRouter!!

//http://localhost:8000/api/v1/users/register

app.use(errorHandler)

export {app}
