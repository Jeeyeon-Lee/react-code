import type {ColumnsType} from "antd/es/table";
import type {Mgr} from "@pages/cmm";
import {Button, Space, Table, Tag} from "antd";
import React, {useState} from "react";

const DsTable = ({ mgrList, rowSelect}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNation, setPageNation] = useState(5);

    const colorMap = {
        '대기': 'red',
        '식사': 'blue',
        '후처리': 'green',
        '작업': 'orange',
        '': 'gray',
    } as const;

    type StatusKey = keyof typeof colorMap;

    const columns: ColumnsType<Mgr> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '이름',
            dataIndex: 'mgrNm',
            key: 'mgrNm',
        },
        {
            title: '부서명',
            dataIndex: 'dptNm',
            key: 'dptNm',
        },
        {
            title: '상태',
            key: 'status',
            dataIndex: 'status',
            render: (status: string, _record: Mgr) => (
                <Tag color={colorMap[status as StatusKey] || 'gray'}>{status}</Tag>
            ),
        },
        {
            title: '액션',
            key: 'action',
            render: (_) => (
                <Space size="middle">
                    <Button type="link">로그아웃</Button>
                </Space>
            ),
        }
    ];

    return (
        <>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={mgrList}
                pagination={{
                    current: currentPage,
                    pageSize: pageNation,
                    showSizeChanger: true,
                    position: ['bottomCenter'],
                    pageSizeOptions: ['5', '10', '20', '50'],
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}건`,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageNation(size)
                    },
                }}
                scroll={{y: 400}}
                scrollToFirstRowOnChange
                showSorterTooltip={{target: 'sorter-icon'}}
                rowSelection={rowSelect ? 'radio' : undefined}
            />
        </>
    );

};

export default DsTable;