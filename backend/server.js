import express from "express"
import cors  from "cors"
import { connect } from "mongoose"
import {connectDB} from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'

// app config 
const app = express()
const port = 4000

//middleware
app.use(express.json())
app.use(cors())

// db config
connectDB();


//api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static("uploads"))

app.use("/api/user",userRouter)



app.get("/",(req,res)=>{
    res.send("Working")
}) // get request

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
}) // listen to the server

// mongodb+srv://bytebun:bytebun1212025@cluster0.rv58u.mongodb.net/?

