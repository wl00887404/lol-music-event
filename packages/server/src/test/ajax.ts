import "dotenv/config";
import axios from "axios";

const ajax = axios.create({
  baseURL: process.env.BASE_URL_FOR_TEST,
  validateStatus: () => true,
});

export default ajax