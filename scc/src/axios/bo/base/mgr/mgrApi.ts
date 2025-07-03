import axios from '@api/api';
import type { Mgr } from '@pages/cmm';

//직원 목록 조회
export const getMgrList = async (): Promise<Mgr[]> => {
    const response = await axios.get<Mgr[]>('/mgr');
    return response.data || [];
};

//직원 상세 조회
export const getMgrDetail = async (mgrId:Mgr['mgrId']) => {
    const response = await axios.get<Mgr[]>(`/mgr?mgrId=${mgrId}`);
    return response.data[0];
};