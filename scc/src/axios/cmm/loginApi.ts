import axios from '@api/api.ts';
import type { Login, Mgr } from '@/types';
import { getMgrDetail } from '@api/bo/base/mgr/mgrApi';

//로그인 유저 조회
export const getLoginMgr = async () => {
    const response = await axios.get<Login[]>('/loginMgr');
    return response.data[0];
};

//로그인 유저 저장
export const saveLoginMgr = async (mgrId:Mgr['mgrId']) => {
    try {
        const mgrDetail: Mgr = await getMgrDetail(mgrId);
        if (!mgrDetail) throw new Error('상담원 정보를 찾을 수 없습니다.');

        const loginMgr: Login = {
            ...mgrDetail,
            loginTime: new Date().toISOString(),
        };

        const response = await axios.patch<Login>(`/loginMgr/1`,loginMgr );

        return response.data;
    } catch (error) {
        console.error('로그인 정보 저장 실패:', error);
        throw error;
    }
};

//로그인 상태 변경(식사, 휴식, 상담가능 등)
export const updateLoginStatus = async (loginInfo:Login, status:Mgr['status']) => {

    if(!loginInfo) return;
    try {
        await axios.patch<Login>(`/mgr/${loginInfo?.mgrId}`, {status});

        const loginMgr: Login = {
            ...loginInfo,
            loginTime: new Date().toISOString(),
            status
        };

        const response = await axios.patch<Login>(`/loginMgr/1`, loginMgr);
        return response.data;

    } catch (error) {
        console.error('로그인 정보 저장 실패:', error);
        throw error;
    }
};