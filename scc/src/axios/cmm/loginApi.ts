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
    console.log(`saveLoginMgr`, mgrId);
    try {
        const mgrDetail: Mgr = await getMgrDetail(mgrId);
        if (!mgrDetail) message.error('상담원 정보를 찾을 수 없습니다.');

        const loginMgr: Login = {
            ...mgrDetail,
            loginTime: new Date().toISOString(),
        };

        const response = await axios.patch<Login>(`/loginMgr/1`,loginMgr );
        console.log(`상담 상태가 변경되었습니다.`, response.data);
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