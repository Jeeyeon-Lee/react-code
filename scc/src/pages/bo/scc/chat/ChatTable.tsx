import type {ColumnsType} from "antd/es/table";
import type {Chat} from "@pages/cmm";
import {Table, Tag} from "antd";
import React, {useEffect, useMemo, useRef, useState} from "react";
import CmmButton from "@components/form/CmmButton.tsx";
import {RedoOutlined} from "@ant-design/icons";
import type {TableRowSelection} from "antd/es/table/interface";

interface ChatTableProps {
    chatList: Chat[];
    onRowClick?: (record: Chat) => React.HTMLAttributes<HTMLElement>;
    scrollY?: number;
    rowSelect?: Boolean;
    excludeColumns?: (string)[];
    onSelectRows?: () => void;
    setColumns?: (cols: ColumnsType<Chat>) => void;
    selectedRowKeys?: [];
    setSelectedRowKeys?: () => void;
}

const ChatTable = ({ chatList, onRowClick, onSelectRows, setColumns, scrollY = 200, excludeColumns, rowSelect, selectedRowKeys, setSelectedRowKeys }: ChatTableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNation, setPageNation] = useState(5);
    const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
    const isColumnsSet = useRef(false);
    const [selectedCount, setSelectedCount] = useState<number>(0);
    
    const colorMap = {
        '신규접수': 'red',
        '진행중': 'blue',
        '완료': 'green',
        '보류': 'orange',
        '': 'gray',
    } as const;

    type StatusKey = keyof typeof colorMap;

    const allColumns: ColumnsType<Chat> = [
        {
            title: 'No',
            key: 'index',
            align: 'center',
            render: (_text, _record, index) =>
                (currentPage - 1) * pageNation + index + 1,
        },
        {
            title: '이용자',
            dataIndex: 'userNm',
            key: 'userNm',
            align: 'center',
        },
        {
            title: '상담사',
            dataIndex: 'mgrNm',
            key: 'mgrNm',
            align: 'center',
            sorter: (a, b) => (a.mgrNm || '').localeCompare(b.mgrNm || ''),
        },
        {
            title: '제목',
            dataIndex: 'title',
            key: 'title',
            align: 'center',
            sorter: (a, b) => (a.title || '').localeCompare(b.title || ''),
        },
        {
            title: '이관여부',
            dataIndex: 'transferYn',
            key: 'transferYn',
            align: 'center',
        },
        {
            title: '등록일시',
            dataIndex: 'regDt',
            key: 'regDt',
            align: 'center',
        },
        {
            title: '시작시간',
            dataIndex: 'callStartTm',
            key: 'callStartTm',
            align: 'center',
        },
        {
            title: '종료시간',
            dataIndex: 'callEndTm',
            key: 'callEndTm',
            align: 'center',
        },
        {
            title: '타입',
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            sorter: (a, b) => (a.type || '').localeCompare(b.type || ''),
        },
        {
            title: '상태',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            onFilter: (value, record) => record.status.indexOf(value as string) === 0,
            sorter: (a, b) => (a.status || '').localeCompare(b.status || ''),
            render: (status: string, _record: Chat) => (
                <Tag color={colorMap[status as StatusKey] || 'gray'}>{status}</Tag>
            ),
        },
    ];

    const columns = useMemo(() => {
        return allColumns.filter(
            col => !excludeColumns?.includes(col?.dataIndex as keyof Chat)
        );
    }, [excludeColumns, currentPage, pageNation]);


    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<Chat> = {
        selectedRowKeys,
        onChange: (_keys, selectedRows) => {
            setSelectedCount(selectedRows.length);
            onSelectRows?.(selectedRows);
            onSelectChange();
        },
        getCheckboxProps: (record: Chat) => ({
            name: record.userNm,
        }),
    };
    const start = () => {
        setSelectedRowKeys([]);
        setSelectedCount(0);
    };


    useEffect(() => {
        if (setColumns && !isColumnsSet.current) {
            setColumns(columns);
            isColumnsSet.current = true;
        }
    }, [columns, setColumns]);

    return (
        <>
            <div style={{textAlign:'right', marginRight:'5px'}}>
                {selectedRowKeys?.length > 0 && <span>총 {selectedCount}건 선택됨</span>}
            </div>
            <Table
                id={"chatTable"}
                key={"chatTable"}
                rowKey="chatSeq"
                columns={columns}
                dataSource={chatList}
                onRow={onRowClick}
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
                scroll={{y: scrollY}}
                scrollToFirstRowOnChange
                showSorterTooltip={{target: 'sorter-icon'}}
                rowSelection={rowSelect ? {type: selectionType, ...rowSelection} : undefined}
            />
        </>
    );

};

export default ChatTable;