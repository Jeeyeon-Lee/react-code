import {useMutation, useQuery} from '@tanstack/react-query';
import { getMgrList, getMgrDetail } from '@api/bo/base/mgr/mgrApi';
import type {Login, Mgr} from '@/types';
import {mgrKeys} from '@query/queryKeys.ts';
import {updateLoginStatus} from "@api/cmm/loginApi.ts";
import queryClient from "@query/queryClient.ts";
import {message} from "antd";


export const useMgrList = () => {
    return useQuery({
        queryKey: mgrKeys.list().queryKey,
        queryFn: () => getMgrList(),
    });
};

export const useMgrDetail = (mgrId:Mgr['mgrId']) => {
    return useQuery({
        queryKey: mgrKeys.detail(mgrId).queryKey,
        queryFn: () => getMgrDetail(mgrId),
        enabled: !!mgrId,
        staleTime: 3000, // 데이터 신선도 유지 시간
        refetchInterval: 6000, // 실시간 주기적 업데이트 원함
        refetchIntervalInBackground: true, //페이지가 포커스 되면 새로고침
    });
};

export const useUpdateMgrStatusMutation = () => {
    return useMutation({
        mutationFn: ({ loginInfo, status }: { loginInfo: Login; status: Login['status'] }) =>
            updateLoginStatus(loginInfo, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['login'] });
            message.success(`계정 상태를 변경하였습니다.`);
        },
    });
};