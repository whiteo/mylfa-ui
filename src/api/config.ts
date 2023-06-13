import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
};

const axiosInstance = axios.create({
  headers: headers,
});

export default axiosInstance;
