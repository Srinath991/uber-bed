import { validationResult } from "express-validator";
import { getAddressCoordinate } from "../services/mapsServices.js";

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
    return res.status(200).json({
      message: "Coordinates fetched successfully",
      data: coordinate,
    });
  } catch (err) {
    console.error("Error fetching coordinates:", err.message);
    return res.status(500).json({
      message: "Could not fetch coordinates, please try again later",
      error: err.message,
    });
  }
};
