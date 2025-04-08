import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import captainRouter from './routes/captainRoutes.js';
import mapsRouter from './routes/mapsRoutes.js';
import rideRouter from './routes/rideRoutes.js';
import { createServer } from 'node:http';

import { initializeSocket } from './socket.js';
config();
connectDB();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/user', userRouter);
app.use('/captain', captainRouter);
app.use('/maps', mapsRouter);
app.use('/ride', rideRouter);
const server = createServer(app);
initializeSocket(server)

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
