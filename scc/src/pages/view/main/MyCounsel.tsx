import { useState, useEffect } from 'react';
import { Input, Button, Select, List, Tag } from 'antd';
import { PhoneTwoTone, MessageTwoTone } from '@ant-design/icons';
import axios from 'axios';

const { Search } = Input;
const { Option } = Select;

interface ChatlItem {
    id: number;
    chatSeq: number;
    chatNo: number;
    userId: string;
    text: string;
    sender: string;
    timestamp: Date;
    status: string;
    type: string;
}

function MyCounsel() {

    const [counselList, setCounselList] = useState<ChatlItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(() => {
        axios.get<ChatlItem[]>('http://localhost:3001/chat')
            .then(res => setCounselList(res.data))
            .catch(err => console.error('데이터 불러오기 실패', err));
    }, []);

    const filteredCounselList = counselList.filter(item => {
        const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                String(item.userId).includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    const getStatusTagColor = (status: ChatlItem['status']) => {
        switch (status) {
            case 'new': return 'red';
            case 'process': return 'blue';
            case 'end': return 'green';
            default: return 'default';
        }
    };

    const getStatusTagText = (status: ChatlItem['status']) => {
        switch (status) {
            case 'new': return '미처리';
            case 'process': return '처리중';
            case 'end': return '처리완료';
            default: return status;
        }
    };

    const getTypeTagColor = (type: ChatlItem['type']) => {
        switch (type) {
            case 'call': return 'purple';
            case 'chat': return 'geekblue';
            default: return 'default';
        }
    };

    const getTypeTagText = (type: ChatlItem['type']) => {
        switch (type) {
            case 'call': return '콜';
            case 'chat': return '챗';
            default: return type;
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
                    <Select
                        defaultValue="all" 
                        size="small" 
                        style={{flex: 1}}
                        onChange={value => setStatusFilter(value)}
                    >
                        <Option value="all">상태 전체</Option>
                        <Option value="new">미처리</Option>
                        <Option value="process">처리중</Option>
                        <Option value="end">처리완료</Option>
                    </Select>
                    <Select
                        defaultValue="all"
                        size="small"
                        style={{flex: 1}}
                        onChange={value => setTypeFilter(value)}
                    >
                        <Option value="all">유형 전체</Option>
                        <Option value="call">콜</Option>
                        <Option value="chat">챗</Option>
                    </Select>
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
                                        {item.userId}
                                        <Tag color={getTypeTagColor(item.type)} style={{ marginLeft: 8 }}>
                                            {getTypeTagText(item.type)}
                                        </Tag>
                                        <Tag color={getStatusTagColor(item.status)}>
                                            {getStatusTagText(item.status)}
                                        </Tag>
                                    </>
                                }
                                description={item.userId}
                            />
                            <div>{item.type == 'call' ? <PhoneTwoTone /> : <MessageTwoTone /> }</div>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default MyCounsel;