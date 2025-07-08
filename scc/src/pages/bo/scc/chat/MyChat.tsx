import { useState } from 'react';
import {Input, Button, List, Space, Badge, Statistic, Modal, message} from 'antd';
import {PhoneTwoTone, MessageTwoTone} from '@ant-design/icons';
import CmmCodeSellect from '@components/form/CmmCodeSelect.tsx';
import type { Chat } from '@pages/cmm';
import { useChatStore } from '@pages/bo/scc/chat/chatStore.ts';
import { useUserStore } from '@pages/bo/base/user/userStore.ts';
import { useCtiStore } from '@pages/cmm/cti/ctiStore.ts';
import CmmTag from '@components/form/CmmTag.tsx';
import { useLogin } from '@pages/cmm/login/useLogin.ts';
import {updateChatStatusMutation, useChatList} from '@pages/bo/scc/chat/useChat.ts';
import {obCallStart, callbackStart, changeChatStatus} from '@pages/cmm/cti/useCti.ts';
import CmmButton from "@components/form/CmmButton.tsx";

const { Timer } = Statistic;

function MyChat() {
    const [startTimes, setStartTimes] = useState<Record<string, number>>({});

    /*상태관리 영역*/
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('all');
    const [type, setType] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'콜백' | '전화'>('전화');

    /*클라이언트 영역 : zustand 관리*/
    const { setChatSeq, setChatType } = useChatStore();
    const { setUserId } = useUserStore();
    const { mutate: updateChatStatus } = updateChatStatusMutation();

    /*서버 영역 : react-query 관리*/
    const { loginInfo, isLoading } = useLogin();
    const { data: chatList = [] } = useChatList({mgrId:loginInfo?.mgrId ?? '', status:status, type:type});
    const { data: fullChatList = []} = useChatList({mgrId:loginInfo?.mgrId ?? '', status:'all', type:'all'});

    const { Search } = Input;

    /*상담 내역 카운트 : 다른영역에서도 쓰이는거면 상단에 올려서 관리 but 여기서만 사용할듯?! */
    const 신규접수Count = fullChatList?.filter(c => c.status === '신규접수').length ?? 0;
    const 보류Count = fullChatList?.filter(c => c.status === '보류').length ?? 0;
    const 진행중Count = fullChatList?.filter(c => c.status === '진행중').length ?? 0;
    const 후처리Count = fullChatList?.filter(c => c.status === '후처리').length ?? 0;
    const 완료Count = fullChatList?.filter(c => c.status === '완료').length ?? 0;

    const handleSelectChat = (chatSeq: Chat['chatSeq'], userId: Chat['userId'], chatType: Chat['type'], chatStatus: Chat['status']) => {
        setChatSeq(chatSeq);
        setUserId(userId);
        setChatType(chatType);
        useCtiStore.getState?.().setChatStatus(chatSeq, chatStatus);
    };

    const syncChatStatus = async (chatSeq: string, status: string) => {
        await changeChatStatus(chatSeq, status); // CTI 상태
        updateChatStatus({ chatSeq, status });   // DB 상태
    };

    const filteredCounselList = chatList.filter(item => {
        const title = item?.title ?? '';
        const userId = String(item?.userId ?? '');
        return title.toLowerCase().includes(searchTerm.toLowerCase()) || userId.includes(searchTerm);
    });

    const getStatusTagColor = (status: Chat['status']) => {
        switch (status) {
            case '신규접수': return 'yellow';
            case '진행중': return 'blue';
            case '후처리': return 'red';
            case '완료': return 'green';
            default: return 'default';
        }
    };

    if (isLoading) return <div>로딩중...</div>;

    return (
        <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '8px', padding: '10px' }}>
            {/*나의 상담 : 상단고정*/}
            <div style={{marginBottom: '10px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                    <h4 style={{margin: 0}}>나의 상담 ({loginInfo?.mgrNm} - {loginInfo?.status} )</h4>
                    <Space size="small">
                        <CmmButton
                            size="small"
                            onClick={() => {
                                callbackStart(loginInfo?.mgrId);
                                setModalType('콜백');
                                setIsModalOpen(true);
                            }}
                            buttonType="전화걸기"
                        >
                            콜백
                        </CmmButton>
                        <CmmButton
                            size="small"
                            onClick={() => {
                                obCallStart(loginInfo?.mgrId);
                                setModalType('전화');
                                setIsModalOpen(true);
                            }}
                            buttonType="전화걸기"
                        >
                            전화걸기
                        </CmmButton>
                    </Space>
                </div>
                <Space size="middle" style={{marginBottom: 8}}>
                    <Badge count={fullChatList.length} color="red" size="small" showZero>
                        <Button size="small" onClick={() => {
                            setStatus('all');
                            setType('all')
                        }}>전체</Button>
                    </Badge>
                    <Badge count={신규접수Count} color="pink" size="small" showZero>
                        <Button size="small" onClick={() => setStatus('신규접수')}>신규</Button>
                    </Badge>
                    <Badge count={진행중Count} color="blue" size="small" showZero>
                        <Button size="small" onClick={() => setStatus('진행중')}>진행</Button>
                    </Badge>
                    <Badge count={후처리Count} color="blue" size="small" showZero>
                        <Button size="small" onClick={() => setStatus('후처리')}>후처리</Button>
                    </Badge>
                    <Badge count={완료Count} color="blue" size="small" showZero>
                        <Button size="small" onClick={() => setStatus('완료')}>완료</Button>
                    </Badge>
                    <Badge count={보류Count} color="blue" size="small" showZero>
                        <Button size="small" onClick={() => setStatus('보류')}>보류</Button>
                    </Badge>
                </Space>
                <Search
                    placeholder="상담 ID 또는 제목 검색"
                    size="small"
                    style={{marginBottom: '8px'}}
                    onSearch={value => setSearchTerm(value)}
                    onChange={e => setSearchTerm(e.target.value)}
                />

                <div style={{display: 'flex', gap: '8px'}}>
                    <CmmCodeSellect group="CHAT_STATUS" value={status} onChange={(value) => setStatus(value)}/>
                    <CmmCodeSellect group="CHANNEL" value={type} onChange={(value) => setType(value)}/>
                </div>
            </div>

            <div style={{overflowY: 'auto'}}>
                <List
                    itemLayout="horizontal"
                    dataSource={filteredCounselList}
                    renderItem={item => (
                        <List.Item>
                            <div style={{marginRight: '14px'}}>{item.type == '콜' ? <PhoneTwoTone/> :
                                <MessageTwoTone/>}</div>
                            <List.Item.Meta
                                title={
                                    <>
                                        <a onClick={() => {
                                            handleSelectChat(item.chatSeq, item.userId, item.type, item.status)
                                        }
                                        }
                                        >
                                            {item.userNm} ({item.mgrNm})
                                            {(item.transferYn &&
                                                <CmmTag color={'grey'}>
                                                    {item.transferYn === 'Y' && '이관'}
                                                </CmmTag>
                                            )}
                                        </a>
                                    </>
                                }
                                description={
                                    <>
                                        {item.title}
                                        {item.status === '신규접수' && (
                                            <Button
                                                type="primary"
                                                size="small"
                                                style={{marginTop: 4}}
                                                onClick={async () => {
                                                    await syncChatStatus(item.chatSeq, '진행중');
                                                    handleSelectChat(item.chatSeq, item.userId, item.type, item.status);
                                                    /*setStartTimes(prev => ({
                                                        ...prev,
                                                        [item.chatSeq]: Date.now()
                                                    }));*/
                                                }}
                                            >
                                                상담 시작
                                            </Button>
                                        )}
                                    </>
                                }
                            />
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
                                <CmmTag color={getStatusTagColor(item.status)}>{item.status}</CmmTag>
                                {item.status === '진행중' && startTimes[item.chatSeq] && (
                                    <Timer
                                        type="countup"
                                        value={startTimes[item.chatSeq]}
                                        format="HH:mm:ss"
                                        style={{ marginTop: 4 }}
                                        aria-setsize={1}
                                    />
                                )}
                            </div>
                        </List.Item>
                    )}
                />
            </div>
            <Modal
                title={modalType === '콜백' ? '콜백 걸기' : '전화걸기'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalOpen(false)}>닫기</Button>,
                    <Button key="call" type="primary" onClick={() => {
                        // 실제 전화 연결 또는 dummy 처리
                        message.success(`${modalType} 실행됨`);
                        setIsModalOpen(false);
                    }}>전화걸기</Button>
                ]}
            >
                <div style={{ marginBottom: 16 }}>
                    최근 통화 이력 또는 전화번호 입력 등 넣을 영역
                </div>
                <Input placeholder="전화번호 입력" />
            </Modal>

        </div>
    );
};

export default MyChat;