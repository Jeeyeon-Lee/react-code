// @ts-ignore
import axios, { AxiosError } from 'axios';

const Api = axios.create({
    baseURL : 'http://localhost:3001',
    headers : {
        'Content-Type' : 'application/json',
    }
})

export default Api;