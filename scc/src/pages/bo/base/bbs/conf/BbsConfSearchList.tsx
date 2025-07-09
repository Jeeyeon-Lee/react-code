import React, {useEffect, useState} from "react";
import {Table} from "antd";
import type {BbsConf} from "@pages/cmm";
import type {ColumnsType} from "antd/es/table";
import {useBbsConfList} from "@pages/bo/base/bbs/conf/useBbsConf.ts";

const rowSelection= {
    onChange: (selectedRowKeys: React.Key[], selectedRows: BbsConf[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: BbsConf) => ({
        name: record.bbsCd,
    }),
};

const BbsConfSearchList = ({ searchParams, setBbsCd, setFormMode }) => {
    const { data: bbsConfList, isLoading } = useBbsConfList(searchParams);
    const [dataSource, setDataSource] = useState<BbsConf[]>([]);
    const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');

    useEffect(() => {
        setDataSource(bbsConfList || []);

        // 우측 상세 영역 초기화 세팅
        setBbsCd(null);
        setFormMode('none');

    }, [bbsConfList, searchParams]);


    const columns: ColumnsType<BbsConf> = [
        { title: "순번", dataIndex: "id", align: "center", width: 100,
            render: (_text, _record, index) => index + 1, },
        {
            title: "제목",
            dataIndex: "bbsNm",
            align: "center",
            sorter: (a, b) => a.bbsNm.localeCompare(b.bbsNm),
        },
        {
            title: "코드",
            dataIndex: "bbsCd",
            align: "center",
            width: 80,
        },
        {
            title: "유형",
            dataIndex: "typeCd",
            align: "center",
            width: 80,
        },
        {
            title: "분류 여부",
            dataIndex: "ctgYn",
            align: "center",
            width: 80,
        },
        {
            title: "관리전용 여부",
            dataIndex: "admYn",
            align: "center",
            width: 80,
        },
        {
            title: "의견글 여부",
            dataIndex: "cmtYn",
            align: "center",
            width: 80,
        },
        {
            title: "공지 여부",
            dataIndex: "ntcYn",
            align: "center",
            width: 80,
        },
        {
            title: "첨부파일 여부",
            dataIndex: "fileYn",
            align: "center",
            width: 80,
        },
        {
            title: "첨부파일 수",
            dataIndex: "fileCnt",
            align: "center",
            width: 80,
        },
        {
            title: "HTML 여부",
            dataIndex: "htmlYn",
            align: "center",
            width: 80,
        },
        { title: "등록일", dataIndex: "regDt", align: "center", width: 100 },
        { title: "최종 수정일", dataIndex: "modiDt", align: "center", width: 100 },
    ];

    const onRowClick = (record: BbsConf) => ({
        onClick: (e) => {
            e.preventDefault();
            setBbsCd(record.bbsCd);
            setFormMode('none');
        }
    });

    return (
        <div>
            <Table<BbsConf>
                rowKey="id"
                rowSelection={{ type: selectionType, ...rowSelection }}
                dataSource={dataSource}
                columns={columns}
                onRow={onRowClick}
            />
        </div>
    );
};

export default BbsConfSearchList;
