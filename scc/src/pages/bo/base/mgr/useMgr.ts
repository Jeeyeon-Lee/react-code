import {useMutation, useQuery} from '@tanstack/react-query';
import { getMgrList, getMgrDetail } from '@api/bo/base/mgr/mgrApi.ts';
import type {Login, Mgr} from '@pages/cmm';
import {mgrKeys} from '@query/queryKeys.ts';

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

