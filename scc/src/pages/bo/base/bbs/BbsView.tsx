import {Descriptions, Form, message, Space, Typography} from 'antd';
import {deleteBbsMutation, useBbsDetail} from "@pages/bo/base/bbs/useBbs.ts";
import type {Bbs} from "@pages/cmm";
import React from "react";
import CmmButton from "@components/form/CmmButton.tsx";

const {Text} = Typography;

const BbsView = ({bbsSeq, setFormMode}) => {
    const [form] = Form.useForm();
    const {data: dataBean} = useBbsDetail<Bbs>(bbsSeq||null);
    const {mutate: deleteBbs} = deleteBbsMutation();

    const handleUpdateBbs = async () => {
        setFormMode('update');
    }

    const handleDeleteBbs = async () => {
        if(!dataBean.id) {
            message.warning('오류 발생');
            return;
        }

        await deleteBbs(dataBean.id);
    }

    return (
        <Descriptions
            bordered
            column={4}
            extra={
                <>
                <Space style={{alignSelf: 'flex-end'}}>

                    <CmmButton
                        type="primary"
                        onClick={() => handleDeleteBbs()}
                        danger>
                        삭제
                    </CmmButton>
                    <CmmButton
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
