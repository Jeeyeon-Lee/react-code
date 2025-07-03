import type {MenuType} from '@pages/cmm';
import axios from "@api/api.ts";

export const getMenuList = async () => {
    const params = new URLSearchParams();

    const response = await axios.get<MenuType[]>(`/menus`);
    return response.data;
};

export const getMenuDetail = async (menuCd: MenuType['menuCd']) => {
    const response = await axios.get<MenuType[]>(`/menus?menuCd=${menuCd}`);
    return response.data;
};