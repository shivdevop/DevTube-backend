import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

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
app.use(express.urlencoded())
app.use(express.static("public"))
//what this does is, it will allow us to access the static files in public folder 

app.use(cookieParser())



export {app}
