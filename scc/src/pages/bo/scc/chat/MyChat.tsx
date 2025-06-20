import { useState } from 'react';
import { Input, Button, List, Space, Badge } from 'antd';
import { PhoneTwoTone, MessageTwoTone, RedoOutlined } from '@ant-design/icons';
import CmmCodeSellect from '@components/form/CmmCodeSellect.tsx';
import type { Chat } from '@/types';
import { useChatStore } from '@stores/bo/scc/chat/chatStore.ts';
import { useUserStore } from '@stores/bo/base/user/userStore.ts';
import CmmTag from '@components/form/CmmTag.tsx';
import { useLogin } from '@hooks/cmm/login/useLogin.ts';
import { useChatList } from '@hooks/bo/scc/chat/useChat.ts';


function MyChat() {
    /*상태관리 영역*/
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('all');
    const [type, setType] = useState('all');

    /*클라이언트 영역 : zustand 관리*/
    const { setChatSeq } = useChatStore();
    const { setUserId } = useUserStore();

    /*서버 영역 : react-query 관리*/
    const { loginInfo, isLoading } = useLogin();
    // @ts-ignore
    const { data: chatList = [] } = useChatList({mgrId:loginInfo?.mgrId ?? '', status:status, type:type});
    const { data: fullChatList = []} = useChatList({mgrId:loginInfo?.mgrId ?? '', status:'all', type:'all'});
    const { Search } = Input;

    /*상담 내역 카운트 : 다른영역에서도 쓰이는거면 상단에 올려서 관리 but 여기서만 사용할듯?! */
    const 대기중Count = fullChatList?.filter(c => c.status === '대기중').length ?? 0;
    const 보류Count = fullChatList?.filter(c => c.status === '보류').length ?? 0;
    const 상담중Count = fullChatList?.filter(c => c.status === '상담중').length ?? 0;
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
            case '대기중': return 'rcallEndTm';
            case '상담중': return 'blue';
            case '완료': return 'green';
            default: return 'default';
        }
    };

    if (isLoading) return <div>로딩중...</div>;

    return (
        <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '8px', padding: '16px' }}>
            {/*나의 상담 : 상단고정*/}
            <div style={{ marginBottom: '16px' }}>
                <div style={{position:'relative', display:'flex'}}>
                    <h4>나의 상담 ({loginInfo?.mgrNm} - {loginInfo?.status} )</h4>

                </div>
                <Space size="middle" style={{ marginBottom: 8 }}>
                    <Badge count={대기중Count} size="small" showZero>
                        <Button size="small" onClick={()=>setStatus('대기중')}>대기중</Button>
                    </Badge>
                    <Badge count={상담중Count} size="small" showZero>
                        <Button size="small" onClick={()=>setStatus('상담중')}>상담중</Button>
                    </Badge>
                    <Badge count={보류Count} size="small" showZero>
                        <Button size="small" onClick={()=>setStatus('보류')}>보류</Button>
                    </Badge>
                    <Badge count={완료Count} size="small" showZero>
                        <Button size="small" onClick={()=>setStatus('완료')}>완료</Button>
                    </Badge>
                    <Badge count={fullChatList.length} size="small" showZero>
                        <Button
                            size="small"
                            style={{color:"rcallEndTm"}}
                            title={"초기화"}
                            icon={<RedoOutlined onClick={()=> { setStatus('all'); setType('all');}}/>}
                        />
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
                                        <a onClick={() => handleSelectChat(item.chatSeq, item.userId)}>
                                            {item.userNm} ({item.mgrNm})
                                            {item.status == '완료' && item.callEndTm.split(' ')[0]}
                                            <CmmTag color={getStatusTagColor(item.status)}>
                                                {item.status}
                                            </CmmTag>
                                            {(item.transferYn &&
                                                <CmmTag color={'grey'}>
                                                    {item.transferYn === 'Y' && '이관'}
                                                </CmmTag>
                                            )}
                                        </a>
                                    </>
                                }
                                description={item.title} //(item.callEndTm.split(' ')[0]}) 값 추가
                            />

                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default MyChat;