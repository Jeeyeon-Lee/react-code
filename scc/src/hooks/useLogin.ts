import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loginKeys } from '@query/queryKeys';
import { getLoginMgr, saveLoginMgr, updateLoginStatus } from '@api/loginApi';
import type { Login, Mgr } from '@/types';
import { useChatStore } from '@stores/chatStore';
import { useUserStore } from '@stores/userStore';
import { message } from 'antd';

export const useLogin = () => {
    const loginInfoQuery = useQuery<Login>({
        queryKey: loginKeys.all.queryKey,
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
    const queryClient = useQueryClient();
    const { clearChatSeq } = useChatStore();
    const { setUserId } = useUserStore();
    return useMutation({
        mutationFn: (mgrId: Mgr['mgrId']) => saveLoginMgr(mgrId),
        onSuccess: () => {
            //성공시, login관련 쿼리들 무효화 -> 재요청 발생(사용하는 컴포넌트 데이터 동기화 되는 부분)
            queryClient.invalidateQueries({ queryKey: ['login'] });
            //성공시 화면단에서 갖고있던 스토어 초기화 필요(적절할 때 가져와서 사용해야함)
            clearChatSeq();
            setUserId('');
            message.success(`다른 상담원 계정으로 로그인하였습니다.`);
        },
    });
};

export const useUpdateLoginStatusMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ loginInfo, status }: { loginInfo: Login; status: Login['status'] }) =>
            updateLoginStatus(loginInfo, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['login'] });
            message.success(`계정 상태를 변경하였습니다.`);
        },
    });
};
