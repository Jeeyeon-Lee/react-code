import { useQuery, useMutation } from '@tanstack/react-query';
import queryClient from '@query/queryClient';
import { loginKeys } from '@query/queryKeys';
import axios from '@api/api';
import { getLoginMgr, saveLoginMgr } from '@api/cmm/loginApi';
import type { Login, Mgr } from '@/types';
import { useChatStore } from '@stores/bo/scc/chat/chatStore';
import { useUserStore } from '@stores/bo/base/user/userStore';
import { message } from 'antd';
import {useUpdateMgrStatusMutation} from "@hooks/bo/base/mgr/useMgr.ts";

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
    const { clearChatSeq } = useChatStore();
    const { setUserId } = useUserStore();
    const { loginInfo } = useLogin();
    const { mutate: updateMgrStatus } = useUpdateMgrStatusMutation();

    return useMutation({
        mutationFn: (mgrId: Mgr['mgrId']) => saveLoginMgr(mgrId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['login'] });
            clearChatSeq();
            setUserId('');
            updateMgrStatus({loginInfo, status: '상담준비'});
            message.success(`다른 상담원 계정으로 로그인하였습니다.`);
        },
    });
};