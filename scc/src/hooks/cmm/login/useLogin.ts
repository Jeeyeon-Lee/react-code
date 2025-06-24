import { useQuery, useMutation } from '@tanstack/react-query';
import queryClient from '@query/queryClient';
import { getLoginMgr, saveLoginMgr } from '@api/cmm/loginApi';
import type { Login, Mgr } from '@/types';
import { message } from 'antd';

export const useLogin = () => {
    const loginInfoQuery = useQuery<Login>({
        queryKey: ['login'],
        queryFn: getLoginMgr,
        /* 바로 비동기 호출을 넣을수도 있는 자리임.
        queryFn: async () => {
            const response = await Api.get<Login[]>('/loginMgr');
            return response.data[0];
        },
        */
    });

    return {
        loginInfo: loginInfoQuery.data,
        isLoading: loginInfoQuery.isLoading,
        error: loginInfoQuery.error,
    };
};

export const useSaveLoginMgrMutation = () => {


    return useMutation({
        mutationFn: (mgrId: Mgr['mgrId']) => saveLoginMgr(mgrId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['login'] });
            message.success(`다른 상담원 계정으로 로그인하였습니다.`);
        },
    });
};