import bootApi from "@pages/test/bootApi.ts";
import { message } from 'antd';
import type {AxiosError} from "axios";

const apiKey = import.meta.env.VITE_API_HEADER_KEY;

export const fetchHello = async (): Promise<string | undefined> => {
    try {
        const res = await bootApi.get('/api/hello', {
            headers: {
                'X-API-KEY': apiKey
            },
            params: {
                groupCd: 'AGENT_STATUS',
                langCd: 'ko'
            }
        });
        return res.data;
    } catch (error: AxiosError) {
        const errorCd = error?.response?.status;

        switch (errorCd) {
            case 400:
                message.error('잘못된 요청입니다. (400)');
                break;
            case 401:
                message.error('인증이 필요합니다. (401)');
                break;
            case 403:
                message.error('접근이 거부되었습니다. (403)');
                break;
            case 404:
                message.error('요청한 자원을 찾을 수 없습니다. (404)');
                break;
            case 500:
                message.error('서버 오류가 발생했습니다. (500)');
                break;
            default:
                message.error(`알 수 없는 오류가 발생했습니다. (${errorCd})`);
        }
        return undefined;
    }
};
