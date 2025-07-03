import { useQuery, useMutation } from '@tanstack/react-query';
import queryClient from '@query/queryClient.ts';
import { getLoginMgr, saveLoginMgr } from '@api/cmm/loginApi.ts';
import type { Login, Mgr } from '@pages/cmm';
import { message } from 'antd';
import {useCtiStore} from "@pages/cmm/cti/ctiStore.ts";

export const useLogin = () => {
    const loginInfoQuery = useQuery<Login>({
        queryKey: ['login'],
        queryFn: getLoginMgr,
    });
    const loginInfo = loginInfoQuery.data;

    return {
        loginInfo: loginInfoQuery.data,
        status: loginInfo?.status,
        mgrId: loginInfo?.mgrId,
        isLoading: loginInfoQuery.isLoading,
        error: loginInfoQuery.error,
    };
};

export const useSaveLoginMgrMutation = () => {

    return useMutation({
        mutationFn: (mgrId: Mgr['mgrId']) => saveLoginMgr(mgrId),
        onSuccess: (_, mgrId) => {
            queryClient.invalidateQueries({ queryKey: ['login'] });
            message.success(`다른 상담원 계정으로 로그인하였습니다.`);
        },
    });
};