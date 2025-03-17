import express from "express"
import { config } from "dotenv"
import cors from 'cors'
import morgan from 'morgan'
config()

const app = express()
app.use(cors())
app.use(morgan("dev"));

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`the server started as port ${PORT}`)
})

