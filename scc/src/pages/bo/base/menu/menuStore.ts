import {create} from 'zustand';
import type {MenuType} from '@pages/cmm';
import {persist} from 'zustand/middleware';

/*zustand를 사용한 전역관리*/
interface MenuStore {
    menuCd: MenuType['menuCd'];
    setMenuCd: (menuCd: MenuType['menuCd']) => void;
    menuList: MenuType[];
    setMenuList: (menuList: MenuType[]) => void;
}

export const useMenuStore = create<MenuStore>()(
    persist(
        (set) => ({
            menuCd: '',
            setMenuCd: (menuCd) => set({ menuCd }),
        }),
        {
            name: 'menu-store', // 로컬스토리지에 저장될 key 이름
        }
    )
);

export const useMenuListStore = create<MenuStore>()(
    persist(
        (set) => ({
            menuList: [],
            setMenuList: (menuList) => set({ menuList }),
        }),
        {
            name: 'menu-list-store', // 로컬스토리지에 저장될 key 이름
        }
    )
);

