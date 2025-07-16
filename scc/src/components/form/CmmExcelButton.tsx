import React, {useMemo, useState} from 'react';
import { useExcelStore } from '@pages/cmm/excel/excelStore.ts';
import {Button, Checkbox, Col, Divider, Modal, Row} from 'antd';
import {FileExcelOutlined} from '@ant-design/icons';
import CmmButton from "@components/form/CmmButton.tsx";
import {downloadExcel} from "@utils/salmon.ts";
import CmmRadioGroup from "@components/form/CmmRadioGroup.tsx";

interface ExcelColumn<T> {
    key: keyof T;
    header: string;
}

interface ExcelDownloadButtonProps<T> {
    defaultColumns?: string[];
    buttonText?: string;
}

const CmmExcelButton = <T,>({
                                    defaultColumns = [],
                                    buttonText = '엑셀다운로드',
                                }: ExcelDownloadButtonProps<T>) => {
    const [value, setValue] = useState<'all' | 'select'>('all');
    const [open, setOpen] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
    const { allData, selectedData, columns, sheetName } = useExcelStore();
    const showModal = () => {
        setCheckedKeys(defaultColumns && defaultColumns.length > 0 ? defaultColumns : []);
        setOpen(true);
    };

    const handleClick = (val) => {
        setCheckedKeys(val); // ✅ 키값만 설정
    };

    const checkbox = useMemo(() => {
        return columns.reduce((acc, curr, idx) => {
            const checkboxIdx = Math.floor(idx / 3);
            if (!acc[checkboxIdx]) acc[checkboxIdx] = [];
            acc[checkboxIdx].push(curr);
            return acc;
        }, [] as ExcelColumn<T>[][]);
    }, [columns]);

    const handleDownloadExcel = () => {
        const rawData =
            value === 'select' ? selectedData : allData;

        const filteredData = rawData.map((row, idx) => {
            const newRow: any = {};
            checkedKeys.forEach(key => {
                if (key === 'index') {
                    newRow.index = idx + 1;
                } else {
                    newRow[key] = row[key];
                }
            });
            return newRow;
        });

        const selectedColumns = columns.filter(col =>
            checkedKeys.includes(col.key as string)
        );

        downloadExcel<T>({
            data: filteredData,
            columns: selectedColumns,
            sheetName,
        });
    };


    return (
        <>
            <Button onClick={(e) => {
                e.stopPropagation();
                showModal();
            }}>
                <FileExcelOutlined style={{ color: 'green' }} /> {buttonText}
            </Button>
            <Modal
                title="엑셀 다운로드"
                open={open}
                onCancel={() => setOpen(false)}
                footer={[
                    ...(!(defaultColumns) || defaultColumns.length > 0
                        ? [<CmmButton key="default" onClick={(e) => {e.stopPropagation(); handleClick(defaultColumns);}}>기본설정</CmmButton>]
                        : []),
                    <CmmButton key="all" onClick={(e) => {e.stopPropagation(); handleClick(columns.map(col => col.key as string));}}>전체선택</CmmButton>,
                    <CmmButton key="reset" onClick={(e) => {e.stopPropagation(); handleClick([]);}}>초기화</CmmButton>,
                    <CmmButton key="back" onClick={(e) => {e.stopPropagation(); setOpen(false);}}>취소</CmmButton>,
                    <CmmButton key="submit" onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadExcel();
                        setOpen(false);
                    }}>다운로드</CmmButton>,
                ]}
            >
                <>
                    <p>출력할 범위를 선택하세요:(TODO : 테이블의 페이징값 접근 필요 페이지값 추가)</p>
                    <CmmRadioGroup
                        options={[
                            { label: '전체', value: 'all' },
                            { label: '선택항목', value: 'select' },
                        ]}
                        onChange={(e) => {
                            e.stopPropagation();
                            console.log(e.target.value);
                            setValue(e.target.value);
                        }}
                        value={value}
                    >
                    </CmmRadioGroup>
                    <Divider />
                    <p>출력할 항목을 선택하세요:</p>
                    {checkbox.map((column, idx) => (
                        <Row gutter={12} key={idx}>
                            {column.map(col => (
                                <Col span={8} key={col.key as string}>
                                    <Checkbox
                                        checked={checkedKeys.includes(col.key as string)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            const newChecked = e.target.checked
                                                ? [...checkedKeys, col.key as string]
                                                : checkedKeys.filter(key => key !== col.key);
                                            setCheckedKeys(newChecked);
                                        }}
                                    >
                                        {col.header}
                                    </Checkbox>
                                </Col>
                            ))}
                        </Row>
                    ))}
                    <Divider />
                </>
            </Modal>
        </>
    );
};

export default CmmExcelButton;
