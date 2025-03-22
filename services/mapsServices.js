import axios from "axios"; 
import { config } from "dotenv";
import { googleMapsEndPoints } from "../config/constants.js";

config()

export const getAddressCoordinate = async (address) => {
  try {
    // Replace 'YOUR_API_KEY' with your actual Google Maps API key
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const endpoint = googleMapsEndPoints.getCoordinates;

    const response = await axios.get(endpoint, {
      params: {
        address: address,
        key: API_KEY,
      },
    });

    // Check if the response contains valid data
    if (response.data.status === "OK") {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error(`Geocoding failed: ${response.data.status}`);
    }
  } catch (error) {
    
    throw error; 
  }
};
