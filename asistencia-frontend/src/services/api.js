import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000', // tu backend Express
});

export default API;