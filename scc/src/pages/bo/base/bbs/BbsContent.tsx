import React, {useEffect, useState} from 'react';
import {Card, Col, Divider, Form, Row} from 'antd';
import BbsSearchForm from "@pages/bo/base/bbs/BbsSearchForm.tsx";
import BbsSearchList from "@pages/bo/base/bbs/BbsSearchList.tsx";
import type {Bbs} from "@pages/cmm";
import {useParams} from "react-router-dom";
import BbsView from "@pages/bo/base/bbs/BbsView.tsx";
import CmmButton from "@components/form/CmmButton.tsx";
import BbsForm from "@pages/bo/base/bbs/BbsForm.tsx";
import CmmSearchForm from "@components/form/CmmSearchForm.tsx";


const BbsContent = () => {
    const [searchParams, setSearchParams] = useState<Bbs | null>(null);
    const [ bbsSeq, setBbsSeq ] = useState<Bbs['bbsSeq']>(null);
    const { bbsCd } = useParams();
    const [formMode, setFormMode] = useState<'none' | 'insert' | 'update'>('none'); // 등록/수정 모드
    const [form] = Form.useForm();

    // 메뉴 변경 동작 시 bbsSeq 값 초기화
    useEffect(() => {
        setBbsSeq(null);
    }, [bbsCd]);

    const handleOpenInsertForm = () => {
        setFormMode('insert');
        setBbsSeq(null); // 상세보기는 초기화
    }

    return (
        <>
        { bbsCd !== '1000' ? (
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
                    <BbsSearchForm form={form} onSearch={setSearchParams} bbsCd={bbsCd}/>
                </Card>
                <Divider />
                </>
            ):(
                <CmmSearchForm
                    form={form}
                    extraButtons={
                        <>
                            <CmmButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("엑셀 다운로드")
                                }
                            }>엑셀다운로드</CmmButton>
                            <CmmButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("카테고리 관리")
                                }
                            }>카테고리</CmmButton>
                            <CmmButton
                                htmlType="submit"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenInsertForm()
                                }
                            }
                            >
                                등록
                            </CmmButton>
                        </>
                    }
                >
                    <BbsSearchForm form={form} onSearch={setSearchParams} bbsCd={bbsCd}/>
                </CmmSearchForm>
            )}

            {/* TODO: 아래 좌우/상하 버전별로 작업해놨음*/}
            {
                bbsCd === '1000' ? (
                    <>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Card title={'검색 결과'}>
                                    <BbsSearchList
                                        setSearchParams={setSearchParams}
                                        searchParams={searchParams}
                                        bbsCd={bbsCd}
                                        setBbsSeq={setBbsSeq}
                                        setFormMode={setFormMode}
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title={formMode === 'none' ? '상세 내용' : '수정/등록'}>
                                    {bbsCd && formMode !== 'none' && (
                                        <BbsForm setFormMode={setFormMode} setBbsSeq={setBbsSeq} bbsSeq={bbsSeq} bbsCd={bbsCd} isExist={formMode === 'update'} />
                                    )}

                                    {formMode === 'none' && !bbsSeq && (
                                        '검색 결과 리스트 클릭 시 상세내용이 나와요.'
                                    )}

                                    {bbsCd && formMode === 'none' && bbsSeq && (
                                        <BbsView bbsSeq={bbsSeq} bbsCd={bbsCd} setFormMode={setFormMode} />
                                    )}
                                </Card>
                            </Col>
                        </Row>
                    </>
                ) :
                    (
                    <>
                        <Card title={'검색 결과'}>
                            <BbsSearchList
                                setSearchParams={setSearchParams}
                                searchParams={searchParams}
                                bbsCd={bbsCd}
                                setBbsSeq={setBbsSeq}
                                setFormMode={setFormMode}
                            />
                        </Card>
                        <Divider />
                        <Card title={formMode === 'none' ? '상세 내용' : '수정/등록'}>
                            {bbsCd && formMode !== 'none' && (
                                <BbsForm bbsSeq={bbsSeq} bbsCd={bbsCd} isExist={formMode === 'update'} />
                            )}

                            {formMode === 'none' && !bbsSeq && (
                                '검색 결과 리스트 클릭 시 상세내용이 나와요.'
                            )}

                            {bbsCd && formMode === 'none' && bbsSeq && (
                                <BbsView bbsSeq={bbsSeq} bbsCd={bbsCd} setFormMode={setFormMode} />
                            )}
                        </Card>
                    </>
                    )
            }
        </>
    );
};

export default BbsContent;