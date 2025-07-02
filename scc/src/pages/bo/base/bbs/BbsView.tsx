import {Button, Descriptions, Form, Input, Space, Typography} from 'antd';
import {useBbsDetail} from "@hooks/bo/base/bbs/useBbs.ts";
import type {Bbs} from "@/types";
import React from "react";
import CmmButton from "@components/form/CmmButton.tsx";
import {DeleteTwoTone, EditFilled} from "@ant-design/icons";

const {Text} = Typography;

const BbsView = ({bbsSeq, setFormMode}) => {
    const [form] = Form.useForm();
    const {data: dataBean} = useBbsDetail<Bbs>(bbsSeq||null);

    const handleUpdateBbs = async () => {
        setFormMode('update');
    }

    const handleDeleteBbs = async () => {

        alert('삭제');
    }

    return (
        <Descriptions
            bordered
            column={4}
            extra={
                <>
                <Space style={{alignSelf: 'flex-end'}}>

                    <CmmButton
                        icon={<DeleteTwoTone /> }
                        type="primary"
                        onClick={() => handleDeleteBbs()}
                        danger>
                        삭제
                    </CmmButton>
                    <CmmButton
                        icon=<EditFilled/>
                        htmlType="submit"
                        onClick={() => handleUpdateBbs()}
                        type="primary"
                        >
                        수정
                    </CmmButton>
                </Space>
                </>
            }
            items={[
                { key: 'title', label: '제목', span: 4, children: dataBean?.title || '-' },
                { key: 'ntcYn', label: '공지여부', span: 2, children: dataBean?.ntcYn === 'Y' ? '공지' : '미공지' || '-' },
                { key: 'readCnt', label: '조회수', span: 2, children: dataBean?.readCnt || 0 },
                { key: 'question', label: '내용', span: 4, children: dataBean?.question || '-' },
                { key: 'ctgCd', label: '분류', span: 2, children: dataBean?.ctgCd || '-' },
                { key: 'ctgCd1', label: '분류1', span: 2, children: dataBean?.ctgCd1 || '-' },
                { key: 'ctgCd2', label: '분류2', span: 2, children: dataBean?.ctgCd2 || '-' },
                { key: 'ctgCd3', label: '분류3', span: 2, children: dataBean?.ctgCd3 || '-' },

                { key: 'regId', label: '등록자', span: 2, children: dataBean?.regId || '-' },
                { key: 'regDt', label: '등록일시', span: 2, children: dataBean?.regDt || '-' },
                { key: 'modiId', label: '수정자', span: 2, children: dataBean?.modiId || '-' },
                { key: 'modiDt', label: '최종 수정일', span: 2, children: dataBean?.modiDt || '-' },
            ]}
        />
    );
};

export default BbsView;
