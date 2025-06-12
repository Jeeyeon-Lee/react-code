import { useState } from 'react';
import { Input, Button, List, Space, Badge } from 'antd';
import { PhoneTwoTone, MessageTwoTone, RedoOutlined } from '@ant-design/icons';
import SelectBox from '@components/cmm/Sellect'
import type { Chat } from '@/types';
import { useChatStore } from '@stores/chatStore';
import { useUserStore } from '@stores/userStore';
import CmmTag from '@components/cmm/CmmTag';
import { useLogin } from '@hooks/useLogin';
import { useChat } from '@hooks/useChat';


function MyCounsel() {
    /*상태관리 영역*/
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('all');
    const [type, setType] = useState('all');

    /*클라이언트 영역 : zustand 관리*/
    const { setChatSeq } = useChatStore();
    const { setUserId } = useUserStore();

    /*서버 영역 : react-query 관리*/
    const { loginInfo, isLoading } = useLogin();
    const { useChatList } = useChat();
    const { data: chatList = [] } = useChatList(loginInfo?.mgrId ?? '', status, type);
    const { data: fullChatList = [] } = useChatList(loginInfo?.mgrId ?? '', 'all', 'all');
    const { Search } = Input;

    /*상담 내역 카운트 : 다른영역에서도 쓰이는거면 상단에 올려서 관리 but 여기서만 사용할듯?! */
    const 미처리Count = fullChatList?.filter(c => c.status === '미처리').length ?? 0;
    const 보류Count = fullChatList?.filter(c => c.status === '보류').length ?? 0;
    const 처리중Count = fullChatList?.filter(c => c.status === '처리중').length ?? 0;
    const 처리완료Count = fullChatList?.filter(c => c.status === '처리완료').length ?? 0;

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
            case '미처리': return 'red';
            case '처리중': return 'blue';
            case '처리완료': return 'green';
            default: return 'default';
        }
    };

    const getTypeTagColor = (type: Chat['type']) => {
        switch (type) {
            case '콜': return 'purple';
            case '챗': return 'geekblue';
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
                    <Badge count={미처리Count} size="small" showZero>
                        <Button size="small" onClick={()=>setStatus('미처리')}>미처리</Button>
                    </Badge>
                    <Badge count={처리중Count} size="small" showZero>
                        <Button size="small" onClick={()=>setStatus('처리중')}>처리중</Button>
                    </Badge>
                    <Badge count={보류Count} size="small" showZero>
                        <Button size="small" onClick={()=>setStatus('보류')}>보류</Button>
                    </Badge>
                    <Badge count={처리완료Count} size="small" showZero>
                        <Button size="small" onClick={()=>setStatus('처리완료')}>처리완료</Button>
                    </Badge>
                    <Badge count={fullChatList.length} size="small" showZero>
                        <Button
                            size="small"
                            style={{color:"red"}}
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
                    <SelectBox group="상담상태" value={status} onChange={(value) => setStatus(value)} />
                    <SelectBox group="상담유형" value={type} onChange={(value) => setType(value)} />
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                <List
                    itemLayout="horizontal"
                    dataSource={filteredCounselList}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={
                                    <>
                                        <a onClick={() => handleSelectChat(item.chatSeq, item.userId)}>
                                            {item.userNm} ({item.mgrNm})
                                            {item.status == '처리완료' && item.ed.split(' ')[0]}
                                            <CmmTag color={getTypeTagColor(item.type)}>
                                                {item.type}
                                            </CmmTag>
                                            <CmmTag color={getStatusTagColor(item.status)}>
                                                {item.status}
                                            </CmmTag>
                                            {(item.transferYn &&
                                                <CmmTag color={'grey'}>
                                                    {item.transferYn==='Y'&&'이관'}
                                                </CmmTag>
                                            )}
                                        </a>
                                    </>
                                }
                                description={item.title}
                            />
                            <div>{item.type == '콜' ? <PhoneTwoTone/> : <MessageTwoTone/>}</div>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default MyCounsel;