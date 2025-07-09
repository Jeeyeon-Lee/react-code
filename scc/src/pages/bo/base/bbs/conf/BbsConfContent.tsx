import React, {useState} from 'react';
import {Card, Col, Divider, Row, Select} from 'antd';
import type {BbsConf} from "@pages/cmm"
import CmmButton from "@components/form/CmmButton.tsx";
import BbsConfSearchForm from "@pages/bo/base/bbs/conf/BbsConfSearchForm.tsx";
import BbsConfSearchList from "@pages/bo/base/bbs/conf/BbsConfSearchList.tsx";
import BbsConfForm from "@pages/bo/base/bbs/conf/BbsConfForm.tsx";
import BbsConfView from "@pages/bo/base/bbs/conf/BbsConfView.tsx";

const { Option } = Select;

const BbsConfContent = () => {
    const [searchParams, setSearchParams] = useState<BbsConf | null>(null);
    const [ bbsCd, setBbsCd ] = useState<BbsConf['bbsCd']>(null);
    const [formMode, setFormMode] = useState<'none' | 'insert' | 'update'>('none'); // 등록/수정 모드

    const handleOpenInsertForm = async () => {
        setFormMode('insert');
        setBbsCd(null); // 상세보기는 초기화
    }

    return (
        <>
            <Card
                extra={
                    <CmmButton
                        htmlType="submit"
                        type="primary"
                        onClick={() => handleOpenInsertForm()}
                    >
                        등록
                    </CmmButton>
                }
                title={'검색'}>
                <BbsConfSearchForm onSearch={setSearchParams} />
            </Card>
            <Divider />
            <Row gutter={24}>
                <Col span={12}>
                    <Card title={'검색 결과'}>
                        <BbsConfSearchList
                            setSearchParams={setSearchParams}
                            searchParams={searchParams}
                            setBbsCd={setBbsCd}
                            setFormMode={setFormMode}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title={formMode === 'none' ? '상세 내용' : '수정/등록'}>
                        {formMode !== 'none' && (
                            <BbsConfForm setFormMode={setFormMode} setBbsCd={setBbsCd} bbsCd={bbsCd} isExist={formMode === 'update'} />
                        )}

                        {formMode === 'none' && !bbsCd && (
                            '검색 결과 리스트 클릭 시 상세내용이 나와요.'
                        )}

                        {formMode === 'none' && bbsCd && (
                            <BbsConfView bbsCd={bbsCd} setFormMode={setFormMode} />
                        )}
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default BbsConfContent;