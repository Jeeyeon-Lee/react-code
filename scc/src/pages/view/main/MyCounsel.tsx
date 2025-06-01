import { useState, useEffect } from 'react';
import { Input, Button, List, Tag } from 'antd';
import { PhoneTwoTone, MessageTwoTone } from '@ant-design/icons';
import { getChatList } from '@api/chatApi';
import SelectBox from '@components/cmm/Sellect'
import type { Chat } from '@/types';

const { Search } = Input;

// @ts-ignore
function MyCounsel({handleChatSeq}) {
    /*상태관리 영역*/
    const [chatList, setChatList] = useState<Chat[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    //채팅리스트
    const fetchChats = async () => {
        try {
            const res = await getChatList();
            setChatList(res.data);
        } catch (err) {
            console.error('채팅 목록 불러오기 실패', err);
        }
    };
    
    useEffect(() => {
        fetchChats();
    }, []);

    
    const filteredCounselList = chatList.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                String(item.userId).includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
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

    return (
        <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '8px', padding: '16px' }}>
            {/*나의 상담 : 상단고정*/}
            <div style={{ marginBottom: '16px' }}>
                <h4>나의 상담</h4>
                <div style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                    <Button size="small">콜백</Button>
                    <Button size="small">전화 끊기</Button>
                </div>
                <Search
                    placeholder="상담 ID 또는 제목 검색"
                    size="small"
                    style={{marginBottom: '8px'}}
                    onSearch={value => setSearchTerm(value)}
                    onChange={e => setSearchTerm(e.target.value)}
                />

                <div style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                    <SelectBox group="상담상태" value={statusFilter} onChange={(value) => setStatusFilter(value)} />
                    <SelectBox group="상담유형" value={typeFilter} onChange={(value) => setTypeFilter(value)} />
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
                                        <a onClick={() => handleChatSeq(item.chatSeq)}>
                                            {item.userNm} ({item.mgrNm})
                                            <Tag color={getTypeTagColor(item.type)} style={{marginLeft: 8}}>
                                                {item.type}
                                            </Tag>
                                            <Tag color={getStatusTagColor(item.status)}>
                                                {item.status}
                                            </Tag>
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