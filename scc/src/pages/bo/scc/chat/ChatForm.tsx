import {useEffect} from 'react';
import {Input, Form, message, Typography, Space} from 'antd';
import {SaveFilled, EditFilled, RedoOutlined} from '@ant-design/icons';
import CmmButton from '@components/form/CmmButton.tsx';
import {
    useChatTextData,
    useChatMemoData,
    insertChatFormTextMutation,
    updateChatFormTextMutation,
    insertChatFormMemoMutation,
    updateChatFormMemoMutation
} from '@pages/bo/scc/chat/useChatForm.ts';
import {useChatStore} from '@pages/bo/scc/chat/chatStore.ts';
import { changeChatStatus } from '@pages/cmm/cti/useCti.ts';

const {TextArea} = Input;
const {Text} = Typography;

const ChatForm = () => {
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const {chatSeq} = useChatStore();
    const {data: chatTextData} = useChatTextData(chatSeq);
    const {data: chatMemoData} = useChatMemoData(chatSeq);
    const {mutate: insertChatFormText} = insertChatFormTextMutation();
    const {mutate: updateChatFormText} = updateChatFormTextMutation();
    const {mutate: insertChatFormMemo} = insertChatFormMemoMutation();
    const {mutate: updateChatFormMemo} = updateChatFormMemoMutation();

    useEffect(() => {
        form1.resetFields();
        form2.resetFields();
        if (chatTextData) form1.setFieldsValue({content: chatTextData.text});
        if (chatMemoData) form2.setFieldsValue({memo: chatMemoData.text});
    }, [chatSeq, chatTextData, chatMemoData]);

    const handleSubmitContent = async (values: any) => {
        if (!chatSeq) {
            message.warning('상담이 선택되지 않았습니다.');
            return;
        }
        !textIsEdit
            ? await insertChatFormText({chatSeq, text: values.content})
            : await updateChatFormText({chatSeq, text: values.content});

        if (!textIsEdit) await changeChatStatus(chatSeq, '완료');

    };
    const handleSubmitMemo = (values: any) => {
        if (!chatSeq) {
            message.warning('상담이 선택되지 않았습니다.');
            return;
        }
        !memoIsEdit
            ? insertChatFormMemo({chatSeq, text: values.memo})
            : updateChatFormMemo({chatSeq, text: values.memo});
    };

    const textIsEdit = !!chatTextData?.text;
    const memoIsEdit = !!chatMemoData?.text;

    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', padding:'15px'}}>
            <div style={{flex: 1, overflow: 'auto'}}>
                <Form
                    form={form1}
                    layout="vertical"
                    onFinish={handleSubmitContent}
                    style={{flex: 1, display: 'flex', flexDirection: 'column'}}
                    requiredMark
                >
                    <Form.Item
                        label="상담 내역"
                        name="content"
                        rules={[
                            {required: true, message: '상담내역을 입력해 주세요.'},
                            {min: 5, message: '5자 이상 입력해 주세요.'},
                        ]}
                        style={{flex: 1}}
                        required tooltip="상담 내역을 입력하세요."
                    >
                        <TextArea rows={6} placeholder="상담내역을 입력하세요"/>
                    </Form.Item>
                    <div style={{width: '100%', textAlign: 'right'}}>
                        {chatTextData?.mgrId && (
                            <Text type="secondary" style={{textAlign: 'right'}}>
                                작성자 : {chatTextData.mgrNm || chatTextData.mgrId} ({chatTextData.regDt.slice(0, 10)})
                                {chatTextData.modiId && (
                                    <>
                                        수정자 : {chatTextData.modiId || chatTextData.modiId} ({chatTextData.modiDt.slice(0, 10)})
                                    </>
                                )}
                            </Text>
                        )}
                    </div>
                    <Space style={{alignSelf: 'flex-end'}}>
                        <CmmButton
                            icon={textIsEdit ? <EditFilled/> : <SaveFilled/>}
                            htmlType="submit"
                            type="primary"
                            buttonType={textIsEdit ? '상담저장' : '상담수정'}
                        >
                            {textIsEdit ? '수정' : '저장'}
                        </CmmButton>
                        <CmmButton
                            icon={<RedoOutlined/>}
                            htmlType="reset"
                            type="dashed"
                            buttonType={textIsEdit ? '상담저장' : '상담수정'}
                        />
                    </Space>
                </Form>
            </div>
            <div style={{flex: 1, overflow: 'auto'}}>
                <Form
                    form={form2}
                    layout="vertical"
                    onFinish={handleSubmitMemo}
                    style={{flex: 1, display: 'flex', flexDirection: 'column'}}
                    requiredMark={false}
                >

                    <Form.Item
                        label="상담 메모"
                        name="memo"
                        rules={[
                            {required: true, message: '메모를 입력해 주세요.'},
                            {min: 5, message: '5자 이상 입력해 주세요.'},
                        ]}
                        tooltip="상담 관련 메모를 입력하세요."
                    >
                        <TextArea rows={6} placeholder="메모를 입력하세요"/>
                    </Form.Item>
                    <div style={{width: '100%', textAlign: 'right'}}>
                        {chatMemoData?.mgrId && (
                            <Text type="secondary" style={{textAlign: 'right'}}>
                                작성자 : {chatMemoData.mgrNm || chatMemoData.mgrId} ({chatMemoData.regDt.slice(0, 10)})
                                {chatMemoData.modiId && (
                                    <>
                                        수정자 : {chatMemoData.modiId || chatMemoData.modiId} ({chatMemoData.modiDt.slice(0, 10)})
                                    </>
                                )}
                            </Text>
                        )}
                    </div>
                    <Space style={{alignSelf: 'flex-end'}}>
                        <CmmButton
                            icon={memoIsEdit ? <EditFilled/> : <SaveFilled/>}
                            htmlType="submit"
                            type="primary"
                            buttonType='상담가능'
                        >
                            {memoIsEdit ? '수정' : '저장'}
                        </CmmButton>
                        <CmmButton
                            icon={<RedoOutlined/>}
                            htmlType="reset"
                            type="dashed"
                            buttonType='상담가능'
                        />
                    </Space>
                </Form>
            </div>
        </div>
    );
};

export default ChatForm;
