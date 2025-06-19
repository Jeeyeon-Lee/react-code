import axios from '@api/api.ts';
import type { Code } from '@/types/bo/base/code/code.ts';

// Code 목록 조회
export const getCodeList = async (group:Code['group']) => {
    const response = await axios.get<Code[]>(
        `/code?group=${group}`
    );
    return response.data;
};
