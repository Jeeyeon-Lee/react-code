import {useQuery} from '@tanstack/react-query';
import {getMgrDetail, getMgrList} from '@api/bo/base/mgr/mgrApi.ts';
import type {Mgr} from '@pages/cmm';
import {createQueryKeys} from "@lukemorales/query-key-factory";

export const mgrKeys = createQueryKeys('mgr', {
    all: null,
    list: () => ['list'],
    detail: (mgrId:Mgr['mgrId']) => ['datail', mgrId],
});

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

