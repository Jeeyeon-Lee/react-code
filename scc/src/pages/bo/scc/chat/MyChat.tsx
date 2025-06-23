import { useState, useEffect } from 'react';
import { Input, Button, List, Space, Badge, Statistic } from 'antd';
import type { StatisticTimerProps } from 'antd';
import { PhoneTwoTone, MessageTwoTone } from '@ant-design/icons';
import CmmCodeSellect from '@components/form/CmmCodeSelect.tsx';
import type { Chat } from '@/types';
import { useChatStore } from '@stores/bo/scc/chat/chatStore.ts';
import { useUserStore } from '@stores/bo/base/user/userStore.ts';
import CmmTag from '@components/form/CmmTag.tsx';
import { useLogin } from '@hooks/cmm/login/useLogin.ts';
import {updateChatStatusMutation, useChatList} from '@hooks/bo/scc/chat/useChat.ts';
import {getLoginMgr} from "@api/cmm/loginApi.ts";

const { Timer } = Statistic;

function MyChat() {
    const [startTimes, setStartTimes] = useState<Record<string, number>>({});

    /*상태관리 영역*/
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('all');
    const [type, setType] = useState('all');

    /*클라이언트 영역 : zustand 관리*/
    const { setChatSeq } = useChatStore();
    const { setUserId } = useUserStore();

    /*서버 영역 : react-query 관리*/
    const { loginInfo, isLoading } = useLogin();
    const { data: chatList = [] } = useChatList({mgrId:loginInfo?.mgrId ?? '', status:status, type:type});
    const { data: fullChatList = []} = useChatList({mgrId:loginInfo?.mgrId ?? '', status:'all', type:'all'});
    const { mutate: updateChatStatus } = updateChatStatusMutation();

    const { Search } = Input;

    /*상담 내역 카운트 : 다른영역에서도 쓰이는거면 상단에 올려서 관리 but 여기서만 사용할듯?! */
    const 대기중Count = fullChatList?.filter(c => c.status === '대기중').length ?? 0;
    const 보류Count = fullChatList?.filter(c => c.status === '보류').length ?? 0;
    const 상담중Count = fullChatList?.filter(c => c.status === '상담중').length ?? 0;
    const 후처리Count = fullChatList?.filter(c => c.status === '후처리').length ?? 0;
    const 완료Count = fullChatList?.filter(c => c.status === '완료').length ?? 0;

    const handleSelectChat = (chatSeq: Chat['chatSeq'], userId: Chat['userId']) => {
        setChatSeq(chatSeq);
        setUserId(userId);
    };

    const filteredCounselList = (chatList ?? []).filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                String(item.userId).includes(searchTerm);
        return matchesSearch;
    });

    const getStatusTagColor = (status: Chat['status']) => {
        switch (status) {
            case '대기중': return 'yellow';
            case '상담중': return 'blue';
            case '후처리': return 'red';
            case '완료': return 'green';
            default: return 'default';
        }
    };

    if (isLoading) return <div>로딩중...</div>;

    const handleUpdateChatStatus = async (chatSeq:Chat['chatSeq'], status: Chat['status']) => {
        if (!(chatSeq || status)) return;
        await updateChatStatus({ chatSeq, status });
    };

    const onFinish: StatisticTimerProps['onFinish'] = () => {
        console.log('finished!');
    };

    const onChange: StatisticTimerProps['onChange'] = (val) => {
        if (typeof val === 'number' && 4.95 * 1000 < val && val < 5 * 1000) {
            console.log('changed!');
        }
    };

    return (
        <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '8px', padding: '16px' }}>
            {/*나의 상담 : 상단고정*/}
            <div style={{ marginBottom: '16px' }}>
                <div style={{position:'relative', display:'flex'}}>
                    <h4>나의 상담 ({loginInfo?.mgrNm} - {loginInfo?.status} )</h4>

                </div>
                <Space size="middle" style={{ marginBottom: 8 }}>
                    <Badge count={fullChatList.length} color="red" size="small" showZero>
                        <Button size="small" onClick={()=> { setStatus('all'); setType('all')}}>전체</Button>
                    </Badge>
                    <Badge count={대기중Count} color="pink" size="small" showZero>
                        <Button size="small" onClick={()=>setStatus('대기중')}>대기</Button>
                    </Badge>
                    <Badge count={상담중Count} color="blue" size="small" showZero>
                        <Button size="small" onClick={()=>setStatus('상담중')}>상담</Button>
                    </Badge>
                    <Badge count={후처리Count} color="blue" size="small" showZero>
                        <Button size="small" onClick={()=>setStatus('후처리')}>후처리</Button>
                    </Badge>
                    <Badge count={완료Count} color="blue" size="small" showZero>
                        <Button size="small" onClick={()=>setStatus('완료')}>완료</Button>
                    </Badge>
                    <Badge count={보류Count} color="blue" size="small" showZero>
                        <Button size="small" onClick={()=>setStatus('보류')}>보류</Button>
                    </Badge>
                </Space>
                <Search
                    placeholder="상담 ID 또는 제목 검색"
                    size="small"
                    style={{marginBottom: '8px'}}
                    onSearch={value => setSearchTerm(value)}
                    onChange={e => setSearchTerm(e.target.value)}
                />

                <div style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                    <CmmCodeSellect group="상담상태" value={status} onChange={(value) => setStatus(value)} />
                    <CmmCodeSellect group="상담유형" value={type} onChange={(value) => setType(value)} />
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                <List
                    itemLayout="horizontal"
                    dataSource={filteredCounselList}
                    renderItem={item => (
                        <List.Item>
                            <div style={{marginRight:'14px'}}>{item.type == '콜' ? <PhoneTwoTone/> : <MessageTwoTone/>}</div>
                            <List.Item.Meta
                                title={
                                    <>
                                        <a onClick={async () =>  {
                                            handleSelectChat(item.chatSeq, item.userId)}
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
                                        {item.status === '대기중' && (
                                            <Button
                                                type="primary"
                                                size="small"
                                                style={{ marginTop: 4 }}
                                                onClick={async () => {
                                                    await handleUpdateChatStatus(item.chatSeq, '상담중');
                                                    handleSelectChat(item.chatSeq, item.userId);
                                                    setStartTimes(prev => ({
                                                        ...prev,
                                                        [item.chatSeq]: Date.now()
                                                    }));
                                                }}
                                            >
                                                상담 시작
                                            </Button>
                                        )}


                                    </>
                                }
                            />
                            <div style={{display:'flex'}}>
                            <CmmTag color={getStatusTagColor(item.status)}>{item.status}</CmmTag>
                            {item.status === '상담중' && startTimes[item.chatSeq] && (
                                <Timer
                                    type="countup"
                                    value={startTimes[item.chatSeq]}
                                    format="HH:mm:ss"
                                    style={{ marginTop: 4 }}
                                />
                            )}
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default MyChat;