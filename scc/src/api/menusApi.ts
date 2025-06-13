import Api from './api';
import type { MenuType } from '@/types';

export const getMenuList = async () => {
    const response = await Api.get<MenuType[]>('/menus');
    return response;
};