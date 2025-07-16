import { create } from 'zustand';

interface ExcelColumn {
    key: string;
    header: string;
}

interface ExcelState<T = any> {
    allData: T[];
    selectedData: T[];
    columns: ExcelColumn[];
    sheetName: string;

    setAllData: (data: T[]) => void;
    setSelectedData: (data: T[]) => void;
    setColumns: (columns: ExcelColumn[]) => void;
    setSheetName: (name: string) => void;

    clearExcelData: () => void;
}

export const useExcelStore = create<ExcelState>((set) => ({
    allData: [],
    selectedData: [],
    columns: [],
    sheetName: 'Sheet1',

    setAllData: (allData) => set({ allData }),
    setSelectedData: (selectedData) => set({ selectedData }),
    setColumns: (columns) => set({ columns }),
    setSheetName: (sheetName) => set({ sheetName }),

    clearExcelData: () =>
        set({ allData: [], selectedData: [], columns: [], sheetName: 'Sheet1' }),
}));
