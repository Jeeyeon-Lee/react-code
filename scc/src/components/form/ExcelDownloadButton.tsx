import React from 'react';
import { Button } from 'antd';
import {downloadExcel} from "@utils/salmon.ts";
import {FileExcelOutlined} from "@ant-design/icons";

interface ExcelColumn<T> {
    key: keyof T;
    header: string;
}

interface ExcelDownloadButtonProps<T> {
    data: T[];
    columns: ExcelColumn<T>[];
    fileName?: string;
    sheetName?: string;
    buttonText?: string;
}

const ExcelDownloadButton = <T,>({
                                    data,
                                    columns,
                                    sheetName = 'Sheet1',
                                }: ExcelDownloadButtonProps<T>) => {
    return (
        <Button
            onClick={(e) => {
                e.stopPropagation();
                downloadExcel<T>({
                    data,
                    columns,
                    sheetName,
                });
            }}
        >
            <FileExcelOutlined style={{color:'green'}}/> 엑셀다운로드
        </Button>
    );
};

export default ExcelDownloadButton;
