import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware.js";
import { getCoordinate } from "../controllers/mapController.js";
import { body } from "express-validator";

const router = Router()

router.get('/co-ordinates',
    [body('address').isString().isLength({min:3})],
     getCoordinate
)

export default router

