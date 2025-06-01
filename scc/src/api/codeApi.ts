import Api from './api';
import type { Code } from '@/types/code';

// Code List
export const getCodeList = async () => {
    const response = await Api.get<Code[]>('/code');
    return response;
};
