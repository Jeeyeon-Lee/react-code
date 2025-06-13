import { Modal, message, Typography, Popover, Button, Space, Select } from 'antd';
import {
    StopTwoTone,
    FileTextOutlined,
    PhoneTwoTone,
    RedoOutlined,
    SmileOutlined,
    DownCircleTwoTone
} from '@ant-design/icons';
import type { Mgr, Login, Chat } from '@/types';
import { useEffect, useState } from 'react';
import { getMgrList } from '@api/mgrApi';
import { useChatStore } from '@stores/chatStore';
import { useUserStore } from '@stores/userStore';
import { useLogin, useSaveLoginMgrMutation, useUpdateLoginStatusMutation } from '@hooks/useLogin';
import { useChat } from '@hooks/useChat';


const { Text } = Typography;
const smileIcon = <SmileOutlined />;

function RightPanelHeader() {
    const [userNm, setUserNm] = useState('-');
    const [mgrList, setMgrList] = useState<Mgr[]>([]);
    const { chatSeq} = useChatStore();
    const { userId } = useUserStore();
    const { loginInfo} = useLogin();
    const { mutate: saveLoginMgr } = useSaveLoginMgrMutation();
    const { mutate: updateLoginStatus } = useUpdateLoginStatusMutation();
    const { useChatDetail, updateChatStatusMutation, updateChatMgrMutation } = useChat();
    const { data: chatData } = useChatDetail(chatSeq);
    const currentStatus = chatData?.[0].status || '';

    const fetchMgrList = async () => {
        try {
            const res = await getMgrList();
            setMgrList(res);
        } catch (error) {
            console.error('담당자 목록 가져오기 실패:', error);
        }
    };

    useEffect(() => {
        if (chatData) {
            setUserNm(chatData[0].userNm);
        } else {
            setUserNm('-');
        }
    }, [chatData]);

    useEffect(() => {
        fetchMgrList();
    }, []);

    const handleUpdateChatStatus = (status: Chat['status']) => {
        updateChatStatusMutation.mutate({ chatSeq, status });
    };

    //상담 팀원 변경(담당자 변경)
    //현재 chatSeq는 update(이관Y, 종료)
    //새로운 chat insert (이관Y, 미처리, mgrId)
    const handleUpdateChatMgr = (mgrId: Mgr['mgrId']) => {
        // updateChatMgrMutation.mutate({ chatSeq, mgrId });
        Modal.confirm({
            title: '이관 확인',
            content: `다른 상담원에게 이관하시겠습니까?`,
            okText: '이관',
            cancelText: '취소',
            onOk: async () => {
                try {
                    await updateChatMgrMutation.mutateAsync({ chatSeq, mgrId });
                    message.success(`다른 상담원에게 이관 완료되었습니다.`);
                } catch (e) {
                    message.error('이관에 실패했습니다.');
                }
            }
        });
    };

    const handleLoginStatusUpdate = (status:Login['status']) => {
        if(loginInfo) {
            updateLoginStatus({ loginInfo, status });
            fetchMgrList();
        }
    }

    const TeamChangeButton = ({ mgrList }: { mgrList: Mgr[] }) => {
        if(chatSeq == "-1") return;
        const handleSelectChange = (mgrId:Mgr['mgrId']) => {
            if (mgrId) handleUpdateChatMgr(mgrId);
        };

        const content = (
            <Select
                style={{ width: 200 }}
                placeholder="담당자 선택"
                onChange={handleSelectChange}
                options={mgrList.map((mgr:Mgr) => ({
                    label: `${mgr.mgrNm}(${mgr.status})`,
                    value: mgr.id,
                    disabled: mgr.status === '휴가',
                }))}
            />
        );

        return (
            <Popover
                placement="topLeft"
                content={content}
                title="팀원변경"
                trigger="click"
            >
                <Button icon={<FileTextOutlined />}>팀원변경</Button>
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
                    <Text strong>{userNm}</Text>
                    {userId && (
                        <Text type="secondary" style={{ marginLeft: '16px' }}>유저정보: {userId}</Text>
                    )}
                </div>
                <div>
                    {loginInfo && (
                        <div style={{ position:'relative', right: 10 }} >
                            <Text strong>{loginInfo.mgrNm}(상태 : {loginInfo.status})</Text>
                            <Space style={{marginLeft: '16px'}}>
                                <Select
                                    prefix="로그인변경 :  "
                                    suffixIcon={smileIcon}
                                    style={{width: 250, textAlign:'center'}}
                                    onChange={(mgrId:Mgr['mgrId']) => {
                                        if (mgrId) {
                                            saveLoginMgr(mgrId);
                                        }
                                    }}
                                    placeholder="담당자 선택"
                                    options={mgrList.map((mgr) => ({
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
                        <TeamChangeButton mgrList={mgrList} />
                        <Button icon={<StopTwoTone />} onClick={() => handleUpdateChatStatus('보류')}>
                            보류
                        </Button>
                    </>
                )}
                {currentStatus !== '미처리' && currentStatus !== '처리중' && (
                    <Button icon={<RedoOutlined />} onClick={() => handleUpdateChatStatus('처리중')}>
                        다시시작
                    </Button>
                )}
                {currentStatus !== '처리중' && (
                    <Button icon={<PhoneTwoTone />} onClick={() => handleUpdateChatStatus('처리중')}>
                        전화걸기
                    </Button>
                )}
                {currentStatus === '처리중' && (
                    <Button icon={<PhoneTwoTone twoToneColor='red' />} onClick={() => handleUpdateChatStatus('처리중')}>
                        전화끊기
                    </Button>
                )}
                {currentStatus !== '처리완료' && (
                    <Button icon={<DownCircleTwoTone />} onClick={() => handleUpdateChatStatus('처리완료')}>
                        완료처리
                    </Button>
                )}

            </Space.Compact>




            <Space.Compact style={{ position: 'absolute', right: 10 }} size="large">
                <Button onClick={() => handleLoginStatusUpdate('상담가능')}>
                    상담가능
                </Button>
                <Button onClick={() => handleLoginStatusUpdate('식사')}>
                    식사
                </Button>
                <Button onClick={() => handleLoginStatusUpdate('휴식')}>
                    휴식
                </Button>
            </Space.Compact>
        </div>
    );
}

export default RightPanelHeader;
