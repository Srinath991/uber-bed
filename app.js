import express from "express"
import { config } from "dotenv"
import cors from 'cors'
import morgan from 'morgan'
import connectDB from "./config/db.js"
import userRouter from "./routes/userRoutes.js"
import cookieParser from "cookie-parser"
import CaptainRouter from "./routes/captainRoutes.js"
config()

const PORT = process.env.PORT | 3000

connectDB()

const app = express()
app.use(cors())
app.use(morgan("dev"));
app.use(express.json())
app.use(cookieParser())
app.use('/user',userRouter)
app.use('/captain',CaptainRouter)



app.listen(PORT, () => {
    console.log(`the server started as port ${PORT}`)
})

