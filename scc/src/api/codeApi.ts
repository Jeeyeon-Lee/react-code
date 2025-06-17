import axios from './api';
import type { Code } from '@/types/code';

// Code 목록 조회
export const getCodeList = async (group:Code['group']) => {
    const response = await axios.get<Code[]>(
        `/code?group=${group}`
    );
    return response.data;
};
