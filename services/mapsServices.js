import axios from "axios";
import { config } from "dotenv";
import { googleMapsEndPoints } from "../config/constants.js";

config()
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export const getAddressCoordinate = async (address) => {
  try {
    // Replace 'YOUR_API_KEY' with your actual Google Maps API key

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
      return { lat, lng };
    } else {
      throw new Error(`Geocoding failed: ${response.data.status}`);
    }
  } catch (error) {

    throw error;
  }
};

export const getDistanceTimeMatrix = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error('Origin and destination are required');
  }

  try {
    const response = await axios.get(googleMapsEndPoints.getDistance, {
      params: {
        origins: origin,
        destinations: destination,
        key: API_KEY,
      },
    });

    if (response.status === 200) {
      const data = response.data;
      if (data.status === 'OK') {
        const element = data.rows[0].elements[0];
        if (element.status === 'OK') {
          return element;
        } else if (element.status === 'ZERO_RESULTS') {
          throw new Error('No route could be found between the origin and destination.');
        } else {
          throw new Error(`Element-level error: ${element.status}`);
        }
      } else {
        throw new Error(`API-level error: ${data.status}`);
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Request failed: ${error.message}`);
  }
};


export const fetchAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error('Input query is required');
  }

  const url = googleMapsEndPoints.placesAutocomplete;

  try {
    const response = await axios.get(url, {
      params: {
        input: input, // Correct parameter name
        key: API_KEY,
      },
    });

    if (response.data.status === 'OK') {
      return response.data.predictions;
    } else {
      throw new Error(`Unable to fetch suggestions: ${response.data.status}`);
    }
  } catch (error) {
    throw new Error(`Error fetching autocomplete suggestions: ${error.message}`);
  }
};




