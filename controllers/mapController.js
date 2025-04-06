import { validationResult } from "express-validator";
import { getAddressCoordinate, getDistanceTimeMatrix,fetchAutoCompleteSuggestions } from "../services/mapsServices.js";

export const getCoordinate = async (req, res) => {
  // Validate request for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { address } = req.body;

  // Handle missing address
  if (!address || address.trim() === "") {
    return res.status(400).json({
      message: "Address is required",
    });
  }

  try {
    // Fetch coordinates from the address
    const coordinate = await getAddressCoordinate(address);
    return res.status(200).json(coordinate);
  } catch (err) {

    return res.status(500).json({
      message: "Could not fetch coordinates, please try again later",
      error: err.message,
    });
  }
};

export const getDistanceTime = (async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const { origin, destination } = req.query;
  try {
    const distanceTime = await getDistanceTimeMatrix(origin, destination)
    res.status(200).json(distanceTime)
  }
  catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
})

export const getAutoCompleteSuggestions = async (req, res, next) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { input } = req.query;
  try {
    const suggestions = await fetchAutoCompleteSuggestions(input);
    res.status(200).json(suggestions);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

