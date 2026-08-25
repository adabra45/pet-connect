import axios from 'axios';

const API = axios.create({
  baseURL: 'https://pet-connect-backend-89fo.onrender.com/api',
});

export default API;