import React from "react";
import type {FormInstance} from "antd";
import {Collapse, Divider} from "antd";
import {SearchOutlined, UndoOutlined} from "@ant-design/icons";
import CmmButton from "@components/form/CmmButton.tsx";


interface Props {
    title?: string;
    resetBtn?: string | 'none';
    searchBtn?: string | 'none';
    form: FormInstance;
    extraButtons?: React.ReactNode;
    children: React.ReactNode;
}

function CmmSearchForm({
                        title = '검색',
                        resetBtn = '초기화',
                        searchBtn = '검색',
                        form,
                        extraButtons,
                        children,
                        }: Props) {
    const items = [
        {
            key: '1',
            label: title,
            children,
            extra:
                <div style={{ display: 'flex', gap: 8 }}>
                    {extraButtons}
                    {resetBtn !== 'none' ? (
                        <CmmButton
                            onClick={(e) => {
                                e.stopPropagation();
                                form.resetFields?.();
                                form.submit();
                            }}
                        >
                            <UndoOutlined /> {resetBtn}
                        </CmmButton>
                    ) : null}
                    {searchBtn !== 'none' ? (
                        <CmmButton
                            onClick={(e) => {
                                e.stopPropagation();
                                form.submit?.();
                            }}
                            type='primary'
                        >
                            <SearchOutlined /> {searchBtn}
                        </CmmButton>
                    ) : null}
                </div>
        },
    ];

    return (
        <>
            <Collapse fontSize={14} size="large" defaultActiveKey={['1']} items={items} />
            <Divider />
        </>
    );
}

export default CmmSearchForm;
