import { useRef } from 'react';
import { Typography, Popover, Space, Select } from 'antd';
import {
    StopTwoTone,
    FileTextOutlined,
    PhoneTwoTone,
    RedoOutlined,
    SmileOutlined,
    DownCircleTwoTone,
    DeleteTwoTone
} from '@ant-design/icons';
import type { Mgr, Login, Chat } from '@/types';
import { useChatStore } from '@stores/bo/scc/chat/chatStore.ts';
import { useUserStore } from '@stores/bo/base/user/userStore.ts';
import { useLogin, useSaveLoginMgrMutation, useUpdateLoginStatusMutation } from '@hooks/cmm/login/useLogin.ts';
import { useChatDetail, updateChatStatusMutation, updateChatMgrMutation, deleteChatMutation } from '@hooks/bo/scc/chat/useChat.ts';
import { useUser } from '@hooks/bo/base/user/useUser.ts';
import { useMgr } from '@hooks/bo/base/mgr/useMgr.ts';
import { salmon } from '@utils/salmon.ts';
import CmmButton from '@components/form/CmmButton.tsx';
import CmmSelect from '@components/form/CmmSelect.tsx';
import type { CmmSelectRef } from '@components/form/CmmSelect.tsx';

const { Text } = Typography;
const smileIcon = <SmileOutlined />;

function ChatHeader() {
    const { chatSeq, clearChatSeq} = useChatStore();
    const { userId, setUserId } = useUserStore();

    const { useUserDetail } = useUser();
    const { data: userDetail } = useUserDetail(userId);

    const { loginInfo} = useLogin();
    const { mutate: saveLoginMgr } = useSaveLoginMgrMutation();
    const { mutate: updateLoginStatus } = useUpdateLoginStatusMutation();
    const { mutate: updateChatMgr } = updateChatMgrMutation();
    const { mutate: updateChatStatus } = updateChatStatusMutation();
    const { mutate: deleteChat } = deleteChatMutation();
    const { data: chatData } = useChatDetail(chatSeq);

    const { useMgrList } = useMgr();
    const { data: mgrList } = useMgrList();

    const currentStatus = chatData?.[0].status || '';
    const isDisabled = !chatSeq;

    const handleUpdateChatStatus = (status: Chat['status']) => {
        if (!chatSeq) return;
        updateChatStatus({ chatSeq, status });
    };
    
    const handleDeleteChat = async () => {
        if(!chatSeq) return;
        await deleteChat(chatSeq);
        clearChatSeq();
        setUserId('');
    }

    const selectRef = useRef<CmmSelectRef>(null);

    const handleUpdateChatMgr = (mgrId: Mgr['mgrId']) => {
        salmon.modal({
            type: 'confirm',
            title: '이관 확인',
            content: `다른 상담원에게 이관하시겠습니까?`,
            onOk: () => { updateChatMgr({chatSeq, mgrId}); },
            onCancel: () => {
                selectRef.current?.reset();
            },
            centered: true,
        });
    };

    const handleLoginStatusUpdate = (status:Login['status']) => {
        if(!loginInfo) return;
        updateLoginStatus({ loginInfo, status });
    }

    const TeamChangeButton = () => {
        if(!chatSeq ) return;
        const handleSelectChange = (mgrId:Mgr['mgrId']) => {
            handleUpdateChatMgr(mgrId!);
        };

        const content = (
            <CmmSelect
                ref={selectRef}
                options={mgrList?.map(mgr => ({
                    label: `${mgr.mgrNm}(${mgr.status})`,
                    value: mgr.id,
                    disabled: mgr.status === '휴가'
                }))}
                onChange={handleSelectChange}
            />
        );

        return (
            <Popover
                placement="topLeft"
                content={content}
                title="팀원변경"
            >
                <CmmButton
                    icon={<FileTextOutlined />}
                >
                    팀원변경
                </CmmButton>
            </Popover>
        );
    };

    return (
        <div
            style={{
                padding: '8px 16px',
                borderBottom: '1px solid #e0e0e0',
                background: '#fff',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                }}
            >

                <div>
                    {userId && (
                        <>
                            <Text strong>{userDetail?.userNm}</Text>
                            <Text type="secondary" style={{ marginLeft: '16px' }}>유저 아이디: {userDetail?.userId}</Text>
                            <Text type="secondary" style={{ marginLeft: '16px' }}>유저 연락처: {userDetail?.mobile}</Text>
                            <Text type="secondary" style={{ marginLeft: '16px' }}>채팅번호: {chatData?.[0].chatSeq}</Text>
                            <Text type="secondary" style={{ marginLeft: '16px' }}>채팅상태: {chatData?.[0].status}</Text>
                        </>
                    )}
                    <Text></Text>
                </div>
                <div>
                    {loginInfo && (
                        <div style={{ position:'relative', right: 10 }} >
                            <Text strong>{loginInfo.mgrNm}(상태 : {loginInfo.status})</Text>
                            <Space style={{marginLeft: '16px'}}>
                                <Select
                                    value={loginInfo.mgrNm}
                                    showSearch
                                    prefix="로그인변경 :  "
                                    suffixIcon={smileIcon}
                                    style={{width: 250, textAlign:'center'}}
                                    onChange={(mgrId:Mgr['mgrId']) => {
                                        if (mgrId) {
                                            saveLoginMgr(mgrId);
                                        }
                                    }}
                                    placeholder="담당자 선택"
                                    optionFilterProp="label"
                                    options={mgrList?.map((mgr) => ({
                                        label: `${mgr.mgrNm}`,
                                        value: mgr.id,
                                        disabled: mgr.status === '휴가',
                                    }))}
                                >
                                </Select>
                            </Space>
                        </div>
                    )}
                </div>
            </div>

            <Space.Compact size="large">
                {currentStatus !== '처리완료' && (
                    <>
                        <TeamChangeButton />
                        {currentStatus !== '보류' && (
                            <CmmButton icon={<StopTwoTone />} onClick={() => handleUpdateChatStatus('보류')} disabled={isDisabled}>
                            보류
                            </CmmButton>
                        )}
                    </>
                )}
                {currentStatus !== '미처리' && currentStatus !== '처리중' && (
                    <CmmButton icon={<RedoOutlined />} onClick={() => handleUpdateChatStatus('처리중')} disabled={isDisabled}>
                        다시시작
                    </CmmButton>
                )}
                {currentStatus !== '처리중' && (
                    <CmmButton icon={<PhoneTwoTone />} onClick={() => handleUpdateChatStatus('처리중')} disabled={isDisabled}>
                        전화걸기
                    </CmmButton>
                )}
                {currentStatus === '처리중' && (
                    <CmmButton icon={<PhoneTwoTone twoToneColor='red' />} onClick={() => handleUpdateChatStatus('처리중')}>
                        전화끊기
                    </CmmButton>
                )}
                {currentStatus !== '처리완료' && (
                    <>
                        <CmmButton icon={<DownCircleTwoTone />} onClick={() => handleUpdateChatStatus('처리완료')} disabled={isDisabled}>
                            완료처리
                        </CmmButton>
                        <CmmButton icon={<DeleteTwoTone /> } onClick={() => handleDeleteChat()} disabled={isDisabled}>
                            삭제
                        </CmmButton>
                    </>
                )}
            </Space.Compact>

            <Space.Compact style={{ position: 'absolute', right: 10 }} size="large">
                <CmmButton onClick={() => handleLoginStatusUpdate('상담가능')}>
                    상담가능
                </CmmButton>
                <CmmButton onClick={() => handleLoginStatusUpdate('식사')}>
                    식사
                </CmmButton>
                <CmmButton onClick={() => handleLoginStatusUpdate('휴식')}>
                    휴식
                </CmmButton>
            </Space.Compact>
        </div>
    );
}

export default ChatHeader;
