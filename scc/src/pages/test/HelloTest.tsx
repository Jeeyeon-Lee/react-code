import React, { useEffect, useState } from 'react';
import {Card, Table} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { fetchHello } from '@api/test/helloApi';
import type {Code} from "@pages/bo/base/code/code.ts";

const HelloTest = () => {
    const [data, setData] = useState<Code[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNation, setPageNation] = useState(20);
    const columns: ColumnsType<Code> = [
        {
            title: 'No',
            key: 'index',
            align: 'center',
            render: (_text, _record, index) =>
                (currentPage - 1) * pageNation + index + 1,
        },
        {
            title: '코드',
            dataIndex: 'groupCd',
            key: 'groupCd',
        },
        {
            title: '이름',
            dataIndex: 'detailNm',
            key: 'detailNm',
        },
        {
            title: '등록일',
            dataIndex: 'regDt',
            key: 'regDt',
        },
        {
            title: '등록자',
            dataIndex: 'regId',
            key: 'regId',
        },
        {
            title: '수정일',
            dataIndex: 'modiDt',
            key: 'modiDt',
        },
        {
            title: '수정자',
            dataIndex: 'modiId',
            key: 'modiId',
        },
        {
            title: '사용여부',
            dataIndex: 'useYn',
            key: 'useYn',
        },
    ];

    useEffect(() => {
        fetchHello()
            .then((res) => {
                setData(res);
            })
            .catch(console.error);
    }, []);

    return (
        <div>
            <Card title={"상세코드 조회(back)"}>
                <Table
                    rowKey="detailCd"
                    columns={columns}
                    dataSource={data}
                    scroll={{y: 600}}
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
                />
            </Card>
        </div>
    );
};

export default HelloTest;
