import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ModalState {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>()(
    devtools(
        (set) => ({
            isOpen: false,
            openModal: () => set({ isOpen: true }),
            closeModal: () => set({ isOpen: false }),
        }),
        { name: 'ModalStore' }
    )
);
