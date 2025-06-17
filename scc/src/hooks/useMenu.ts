import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getMenuList, getMenuDetail
} from '@api/menusApi';
import type { MenuType } from '@/types';

export const useMenu = () => {
    const queryClient = useQueryClient();

    const useMenuList = () => {

        return useQuery({
            queryKey: ['menu'],
            queryFn: () => getMenuList(),
            staleTime: 3000, // 데이터 신선도 유지 시간
            refetchInterval: 6000, // 실시간 주기적 업데이트 원함
            refetchIntervalInBackground: true, //페이지가 포커스 되면 새로고침
        });
    };

    const useMenuDetail = (menuCd:MenuType['menuCd']) => {
        return useQuery({
            // queryKey: chatKeys.detail(chatSeq).queryKey,
            queryKey: ['menuCd', menuCd],
            queryFn: () => getMenuDetail(menuCd),
            enabled: !!menuCd
        });
    };

    return {
        useMenuList,
        useMenuDetail,
    };
};

