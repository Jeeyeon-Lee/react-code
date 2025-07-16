import axios from 'axios';
const apiKey = import.meta.env.VITE_API_HEADER_KEY;

const bootApi = axios.create({
    headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
    },
});

export default bootApi;
