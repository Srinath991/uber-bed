import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware.js";
import { getCoordinate,getDistanceTime,getAutoCompleteSuggestions } from "../controllers/mapController.js";
import { body, query } from "express-validator";

const router = Router()

router.get('/co-ordinates',
    [body('address').isString().isLength({ min: 3 })],
    authUser,
    getCoordinate
)
router.get('/distance-time',
    [query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 })
    ],
    authUser,
    getDistanceTime

)
router.get('/suggestions',
    [query('input').isString().isLength({ min: 3 })],
    // authUser,
    getAutoCompleteSuggestions

)

export default router

