import axios from 'axios';

export const fetchHello = async (): Promise<string> => {
    const res = await axios.get('/api/hello'); // proxy 설정 덕분에 localhost:8080 호출됨
    return res.data;
};