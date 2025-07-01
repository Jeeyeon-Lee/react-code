import axios from '@api/api.ts';
import type { Login, Mgr } from '@/types';
import { getMgrDetail } from '@api/bo/base/mgr/mgrApi';
import { message } from 'antd';

//로그인 유저 조회
export const getLoginMgr = async () => {
    const response = await axios.get<Login[]>('/loginMgr');
    return response.data[0];
};

//로그인 유저 저장
export const saveLoginMgr = async (mgrId:Mgr['mgrId']) => {
    try {
        const mgrDetail: Mgr = await getMgrDetail(mgrId);
        if (!mgrDetail) message.error('상담원 정보를 찾을 수 없습니다.');
        const loginMgr: { mgrId: string; loginTime: string; mgrNm: string; id: string; deptNm: string; status: string } = {
            ...mgrDetail,
            status:'상담준비',
            loginTime: new Date().toISOString(),
        };
        const response = await axios.patch<Login>(`/loginMgr/1`,loginMgr );
        return response.data;
    } catch (error) {
        console.error('로그인 정보 저장 실패:', error);
        throw error;
    }
};

//로그인 상태 변경(이석-식사, 휴식, 상담준비 등)
export const updateLoginStatus = async (loginInfo:Login, status:Mgr['status']) => {
    if(!loginInfo) return;

    try {
        //직원 상태 업데이트(서버)
        await axios.patch<Login>(`/mgr/${loginInfo?.mgrId}`, {status});
        const loginMgr: Login = {
            ...loginInfo,
            loginTime: new Date().toISOString(),
            status:status
        };

        //로그인 상태 업데이트(서버)
        await axios.patch<Login>(`/loginMgr/1`, loginMgr);

    } catch (error) {
        console.error('로그인 정보 저장 실패:', error);
        throw error;
    }
};