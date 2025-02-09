import axios from "axios";

/**
 * Creating new instance of axios and pass baseURL as a 
 * parameter to the instance.
 * 
 * BACKEND_SERVER_URL value set in .env.local file
 * we can access variable set in environment file
 * using process.env 
 * 
 * exporting the apiClient constant so that other function
 * can use this axios instace to send request to the backend
 * server
 */
export const apiClient = axios.create({
  withCredentials: true,
  baseURL: `${process.env.BACKEND_SERVER_URL}`
});