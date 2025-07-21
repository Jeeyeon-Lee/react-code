import React, {useEffect, useState} from "react";
import {Table} from "antd";
import type {Bbs} from "@pages/cmm";
import type {ColumnsType} from "antd/es/table";
import {useBbsList} from "@pages/bo/base/bbs/core/useBbs.ts";

const rowSelection= {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Bbs[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: Bbs) => ({
        name: record.bbsSeq,
    }),
};

const BbsSearchList = ({ bbsCd, searchParams, setSearchParams, setBbsSeq, setFormMode }) => {
    const { data: bbsList, isLoading } = useBbsList(searchParams);
    const [dataSource, setDataSource] = useState<Bbs[]>([]);
    const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');

    // 아래 동작 취하면 검색 init
    useEffect(() => {
        if (bbsCd) {
            setSearchParams({ bbsCd }); // 기본값 세팅
        }
    }, [bbsCd]);

    useEffect(() => {
        setDataSource(bbsList || []);
    }, [bbsList, searchParams]);


    const columns: ColumnsType<Bbs> = [
        { title: "", dataIndex: "id", hidden: true },
        { title: "순번", dataIndex: "bbsSeq", align: "center", width: 100,
            render: (_text, _record, index) => index + 1, },
        {
            title: "제목",
            dataIndex: "title",
            align: "center",
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: "작성자",
            dataIndex: "regId",
            align: "center",
            width: 80,
            sorter: (a, b) => a.regId - b.regId,
        },
        {
            title: "공지 여부",
            dataIndex: "ntcYn",
            align: "center",
            width: 80,
            sorter: (a, b) => a.ntcYn - b.ntcYn,
        },
        { title: "첨부파일 수", dataIndex: "regId", align: "center", width: 100 },
        { title: "조회수", dataIndex: "readCnt", align: "center", width: 100 },
        { title: "등록일", dataIndex: "regDt", align: "center", width: 100 },
        { title: "최종 수정일", dataIndex: "modiDt", align: "center", width: 100 },
    ];

    const onRowClick = (record: Bbs) => ({
        onClick: (e) => {
            e.preventDefault();
            setBbsSeq(record.bbsSeq);
            setFormMode('none');
        }
    });

    return (
        <div>
            <Table<Bbs>
                rowKey="id"
                rowSelection={{ type: selectionType, ...rowSelection }}
                dataSource={dataSource}
                columns={columns}
                onRow={onRowClick}
            />
        </div>
    );
};

export default BbsSearchList;
