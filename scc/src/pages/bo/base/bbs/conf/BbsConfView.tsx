import {Descriptions, Form, message, Space, Typography} from 'antd';
import type {BbsConf} from "@pages/cmm";
import React from "react";
import CmmButton from "@components/form/CmmButton.tsx";
import {deleteBbsConfMutation, useBbsConfDetail} from "@pages/bo/base/bbs/conf/useBbsConf.ts";

const {Text} = Typography;

const BbsConfView = ({bbsCd, setFormMode}) => {
    const [form] = Form.useForm();
    const {data: dataBean} = useBbsConfDetail<BbsConf>(bbsCd||null);
    const {mutate: deleteBbsConf} = deleteBbsConfMutation();

    const handleUpdateBbsConf = async () => {
        setFormMode('update');
    }

    const handleDeleteBbsConf = async () => {
        if(!dataBean.id) {
            message.warning('오류 발생');
            return;
        }

        await deleteBbsConf(dataBean.id);
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
                        onClick={() => handleDeleteBbsConf()}
                        danger>
                        삭제
                    </CmmButton>
                    <CmmButton
                        htmlType="submit"
                        onClick={() => handleUpdateBbsConf()}
                        type="primary"
                        >
                        수정
                    </CmmButton>
                </Space>
                </>
            }
            items={[
                { key: 'bbsNm', label: '게시판명', span: 2, children: dataBean?.bbsNm || '-' },
                { key: 'bbsCd', label: '게시판 코드', span: 2, children: dataBean?.bbsCd || '-'},
                { key: 'typeCd', label: '게시판 유형', span: 2, children: dataBean?.typeCd || '-' },
                { key: 'ctgYn', label: '분류 여부', span: 2, children: dataBean?.ctgYn || '-' },
                { key: 'admYn', label: '관리전용 여부', span: 2, children: dataBean?.admYn || '-' },
                { key: 'cmtYn', label: '의견글 여부', span: 2, children: dataBean?.cmtYn || '-' },
                { key: 'ntcYn', label: '공지 여부', span: 2, children: dataBean?.ntcYn || '-' },
                { key: 'fileYn', label: '첨부파일 여부', span: 2, children: dataBean?.fileYn || '-' },
                { key: 'fileCnt', label: '첨부파일 수', span: 2, children: dataBean?.fileCnt || '0' },
                { key: 'htmlYn', label: 'HTML 여부', span: 2, children: dataBean?.htmlYn || '-' },


                { key: 'regId', label: '등록자', span: 2, children: dataBean?.regId || '-' },
                { key: 'regDt', label: '등록일시', span: 2, children: dataBean?.regDt || '-' },
                { key: 'modiId', label: '수정자', span: 2, children: dataBean?.modiId || '-' },
                { key: 'modiDt', label: '최종 수정일', span: 2, children: dataBean?.modiDt || '-' },
            ]}
        />
    );
};

export default BbsConfView;
