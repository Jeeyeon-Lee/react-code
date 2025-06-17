import type { MenuType } from '@/types';
import axios from "@api/api.ts";

export const getMenuList = async (menuCd: MenuType['menuCd'], highMenuCd: MenuType['highMenuCd']) => {
    const params = new URLSearchParams();
    if ( menuCd ) params.append('menuCd', menuCd);
    if ( highMenuCd ) params.append('highMenuCd', highMenuCd);

    const response = await axios.get<MenuType[]>(`/menus?${params.toString()}`);
    return response.data;
};

export const getMenuDetail = async (menuCd: MenuType['menuCd']) => {
    const response = await axios.get<MenuType[]>(`/menus?menuCd=${menuCd}`);
    return response.data;
};