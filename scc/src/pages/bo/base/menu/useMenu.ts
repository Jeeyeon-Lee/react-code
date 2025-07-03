import {useMutation, useQuery} from '@tanstack/react-query';
import type {MenuType} from '@pages/cmm';
import axios from "@api/api.ts";
import {salmon} from "@utils/salmon.ts";
import {getLoginMgr} from "@api/cmm/loginApi.ts";
import queryClient from "@query/queryClient.ts";
import {message} from "antd";

export const useMenuList = () => {
    return useQuery({
        queryKey: ['menuList'],
        queryFn: async () => {
            const response = await axios.get<MenuType[]>(`/menus?_sort=orderNo&_order=asc`);
            return response.data;
        }
    });
};

export const useMenuDetail = (menuCd:MenuType['menuCd']) => {

    return useQuery({
        // queryKey: chatKeys.detail(chatSeq).queryKey,
        queryKey: ['menuDetail', menuCd],
        queryFn: async () => {
            const response = await axios.get<MenuType[]>(`/menus?menuCd=${menuCd}`);
            return response.data[0] || [];
        },
        enabled: !!menuCd
    });
};

export const insertMenuMutation = () => {
    return useMutation({
            mutationFn: async (values:MenuType) => {
            if (!values.menuCd) return;
            const newDate = salmon.date.newDate().format('YYYY/MM/DD HH:mm:ss');
            const loginInfo = await getLoginMgr();
            try {
                const newMenuId = salmon.date.newDate().format('YYYYMMDD_HHmmss');
                values.id = newMenuId.toString();
                values.useYn = 'Y';
                values.regDt = newDate;
                values.regId = loginInfo?.mgrId;
                values.regNm = loginInfo?.mgrNm;

                await axios.post<MenuType>(`/menus`, values);

                //TODO orderNo 라스트 체크
            } catch (error) {
                console.error('메뉴 등록 실패:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['menuList'] });
            message.success(`메뉴가 등록되었습니다.`);
        },
        onError: async () => {
            message.error('메뉴 등록에 실패했습니다.');
        },
    });
};


export const updateMenuMutation = () => {

    return useMutation({
        mutationFn: async ({ menuId, values } : { menuCd: MenuType['id'], values:MenuType}) => {
            if (!menuId) return;
            const newDate = salmon.date.newDate().format('YYYY/MM/DD HH:mm:ss');
            const loginInfo = await getLoginMgr();
            try {
                values.modiDt = newDate;
                values.modiId = loginInfo?.mgrId;
                values.modiNm = loginInfo?.mgrNm;

                await axios.patch<MenuType>(`/menus/${menuId}`, values);
            } catch (error) {
                console.error('메뉴 수정 실패:', error);
                throw error;
            }
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: ['menuDetail'] });
            await queryClient.invalidateQueries({ queryKey: ['menuList'] });

            message.success(`메뉴가 수정되었습니다.`);
        },
        onError: () => {
            message.error('메뉴 수정에 실패했습니다.');
        }
    })
};

export const deleteMenuMutation = () => {
    return useMutation({
        mutationFn: async (menuId: MenuType['id']) => {
            try {
                await axios.delete<MenuType>(`/menus/${menuId}` );
            } catch (error) {
                console.error('메뉴 삭제 실패:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['menuList'] });
            await queryClient.invalidateQueries({ queryKey: ['menuDetail'] });
            message.success(`메뉴가 삭제되었습니다.`);
        },
        onError: async () => {
            message.error('메뉴 삭제에 실패했습니다.');
        },
    });
};


export const MoveMenuMutation = () => {

    return useMutation({
        mutationFn: async ({ menuCd, values } : { menuCd: MenuType['id'], values: {}}) => {
            if (!menuCd || !values.highMenuCd) return;
            const newDate = salmon.date.newDate().format('YYYY/MM/DD HH:mm:ss');
            const loginInfo = await getLoginMgr();

            try {
                // 1. 같은 highMenuCd를 가진 목록 가져오기
                const res = await axios.get<MenuType[]>(`/menus?highMenuCd=${values.highMenuCd}&_sort=orderNo&_order=asc`);
                let sameLevelList = res.data.filter(item => item.menuCd !== 'ROOT') || [];

                // 2. orderNo 값 보정
                let newOrderNo = values.orderNo;
                if (newOrderNo <= 0) newOrderNo = 1;
                if (newOrderNo > sameLevelList.length) newOrderNo = sameLevelList.length + 1;

                // 3. 이동할 메뉴 객체 (기존 menuCd 찾아서 새로운 위치에 삽입)
                const movingMenuRes = await axios.get<MenuType>(`/menus?menuCd=${menuCd}`);
                const movingMenu = movingMenuRes.data[0];

                // 현재 리스트에서 제거 후 삽입
                sameLevelList = sameLevelList.filter(m => m.menuCd !== menuCd);
                sameLevelList.splice(newOrderNo - 1, 0,
                    { ...movingMenu,
                    highMenuCd: values.highMenuCd
                    });

                // 4. 전체 orderNo 재정렬
                for (let i = 0; i < sameLevelList.length; i++) {
                    const item = sameLevelList[i];
                    await axios.patch(`/menus/${item.id}`, {
                        orderNo: i + 1,
                        highMenuCd: item.highMenuCd,
                        modiId: loginInfo?.mgrId,
                        modiDt: newDate
                    });
                }

            } catch (error) {
                console.error('메뉴 수정 실패:', error);
                throw error;
            }
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: ['menuList'] });
            await queryClient.invalidateQueries({ queryKey: ['menuDetail'] });
            message.success(`메뉴가 수정되었습니다.`);
        },
        onError: async () => {
            message.error('메뉴 수정에 실패했습니다.');
        }
    })
};
