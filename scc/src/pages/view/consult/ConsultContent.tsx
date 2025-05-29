import React from 'react';
import { Card, Table, Tag, Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
    status: 'pending' | 'in-progress' | 'completed';
}

const ConsultContent: React.FC = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: '이름',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '나이',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '주소',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '태그',
            key: 'tags',
            dataIndex: 'tags',
            render: (tags: string[]) => (
                <>
                    {tags.map(tag => (
                        <Tag color="blue" key={tag}>
                            {tag}
                        </Tag>
                    ))}
                </>
            ),
        },
        {
            title: '상태',
            key: 'status',
            dataIndex: 'status',
            render: (status: string) => {
                let color = 'green';
                if (status === 'pending') color = 'gold';
                if (status === 'in-progress') color = 'blue';
                return (
                    <Tag color={color}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: '액션',
            key: 'action',
            render: (_) => (
                <Space size="middle">
                    <Button type="link">상세보기</Button>
                    <Button type="link">수정</Button>
                </Space>
            ),
        },
    ];

    const data: DataType[] = [
        {
            key: '1',
            name: '홍길동',
            age: 32,
            address: '서울시 강남구',
            tags: ['긴급', '신규'],
            status: 'pending',
        },
        {
            key: '2',
            name: '김철수',
            age: 42,
            address: '서울시 서초구',
            tags: ['일반'],
            status: 'in-progress',
        },
    ];

    return (
        <Card title="상담 관리">
            <Table columns={columns} dataSource={data} />
        </Card>
    );
};

export default ConsultContent; 