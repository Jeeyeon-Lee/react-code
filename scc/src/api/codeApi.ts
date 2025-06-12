import Api from './api';
import type { Code } from '@/types/code';

// Code 목록 조회
export const getCodeList = async (group:Code['group']) => {
    const response = await Api.get<Code[]>(
        `/code?group=${group}`
    );
    return response.data;
};
