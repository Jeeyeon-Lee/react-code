// ✅ 코드성 데이터 정보
import React from "react";

export interface MenuType {
    id: number;
    menuCd: string;
    highMenuCd: string;
    icon?: React.ReactNode;
    path: string;
    label: string;
    children?: MenuType[];
    orderNo: number;
    useYn: string;
    menuNo: number;
    regId : string;
    regNm : string;
    regDt : string;
    modiId: string;
    modiNm: string;
    modiDt: string;
}
