import express from "express"
import { config } from "dotenv"
import cors from 'cors'
import morgan from 'morgan'
import connectDB from "./config/db.js"
import userRouter from "./routes/userRoutes.js"
import cookieParser from "cookie-parser"
import captainRouter from "./routes/captainRoutes.js"
import mapsRouter from "./routes/mapsRoutes.js"
config()

const PORT = process.env.PORT | 3000

connectDB()

const app = express()
app.use(cors())
app.use(morgan("dev"));
app.use(express.json())
app.use(cookieParser())
app.use('/user', userRouter)
app.use('/captain', captainRouter)
app.use('/maps', mapsRouter)



app.listen(PORT, () => {
    console.log(`the server started as port ${PORT}`)
})

