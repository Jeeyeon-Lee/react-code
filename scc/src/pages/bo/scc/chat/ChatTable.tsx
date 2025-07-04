import type {ColumnsType} from "antd/es/table";
import type {Chat} from "@pages/cmm";
import {Table, Tag} from "antd";
import React, {useState} from "react";

interface ChatTableProps {
    chatList: Chat[];
    onRowClick?: (record: Chat) => React.HTMLAttributes<HTMLElement>;
    scrollY?: number; // ✅ 추가
}


const ChatTable = ({ chatList, onRowClick, scrollY = 200 }: ChatTableProps) => {
    const [pageNation, setPageNation] = useState(5);

    const colorMap = {
        '대기중': 'rcallEndTm',
        '상담중': 'blue',
        '완료': 'green',
        '보류': 'orange',
        '': 'gray',
    } as const;

    type StatusKey = keyof typeof colorMap;

    const columns: ColumnsType<Chat> = [
        {title: '이용자', dataIndex: 'userNm', key: 'userNm', align: 'center'},
        {
            title: '상담사',
            dataIndex: 'mgrNm',
            key: 'mgrNm',
            sorter: (a, b) => a.mgrNm.localeCompare(b.mgrNm),
            align: 'center'
        },
        {
            title: '제목',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            align: 'center'
        },
        {
            title: '상태',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            sorter: (a, b) => a.status?.localeCompare(b.status),
            render: (status: StatusKey) => (
                <Tag color={colorMap[status]}>{status}</Tag>
            )
        },
        {
            title: '종료',
            dataIndex: 'callEndTm',
            key: 'callEndTm',
            sorter: (a, b) => a.callEndTm.localeCompare(b.callEndTm),
            align: 'center',
            render: (callEndTm: string) => callEndTm?.slice(0, 10) || '-'
        },
    ];

    return (
        <Table
            rowKey="chatSeq"
            columns={columns}
            dataSource={chatList}
            onRow={onRowClick}
            pagination={{
                pageSize: pageNation,
                showSizeChanger: true,
                position: ['bottomCenter'],
                pageSizeOptions: ['5', '10', '20', '50'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}건`,
                onChange: (_page, pageSize) => setPageNation(pageSize),

            }}
            scroll={{y: scrollY}}
            scrollToFirstRowOnChange
        />
    );

};

export default ChatTable;