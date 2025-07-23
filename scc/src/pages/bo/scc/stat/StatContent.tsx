import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Chat } from "@pages/bo/scc/chat/chat.ts";
import { useChatList } from "@pages/bo/scc/chat/useChat.ts";
import {useMgrList} from "@pages/bo/base/mgr/useMgr.ts";
import {Card} from "antd";
import StatLineChart from "@pages/bo/scc/stat/StatLineChart.tsx";
import StatPieChart from "@pages/bo/scc/stat/StatPieChart.tsx";
import StatDeptChart from "@pages/bo/scc/stat/StatDeptChart.tsx";

const StatContent = () => {
    const { type } = useParams();
    const [searchParams, setSearchParams] = useState<Chat>({} as Chat);
    const [orgData, setOrgData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
    const { data: chatList = [] } = useChatList(searchParams);
    const {data: mgrList = []} = useMgrList();
    const chartedData = type === 'work' ? mgrList ?? [] : chatList ?? [];

    /*ant chart 색상용 : TODO pie 차트랑 통일 필요*/
    const getStatusColor = (status: string): 'online' | 'offline' | 'busy' => {
        if (['로그인', '대기', '작업', '후처리', '모니터링', 'OB작업'].includes(status)) return 'online';
        if (status === '로그아웃') return 'busy';
        return 'offline';
    };

    useEffect(() => {
        if (type !== 'work') {
            setSearchParams({ type: type === 'callMon' ? '콜' : '채팅' } as Chat);
        }
    }, [type]);

    useEffect(() => {
        const nodes = mgrList?.map((mgr) => ({
            id: String(mgr?.id),
            data: {
                name: mgr?.mgrNm,
                title: mgr?.dptNm,
                phone: mgr?.mobile,
                status: getStatusColor(mgr?.status) ?? 'offline',
                position: mgr?.position,
            },
        }));
        /*dptNm 상담1팀인 id -> source : '6' , 상담2팀인 id -> source : '4', id 6, 4는 source 5로*/
        const edges = mgrList.flatMap((mgr) => {
            const targetId = String(mgr.id);
            const dept = mgr.dptNm;
            const mgrNm = mgr.mgrNm;
            const result = [];

            // 상담원 → 팀장 연결
            if (dept === '상담1팀' && !mgr.position.includes('팀장')) {
                result.push({ source: '6', target: targetId });
            } else if (dept === '상담2팀' && !mgr.position.includes('팀장')) {
                result.push({ source: '4', target: targetId });
            }

            // 팀장 → 관리자 연결
            if (mgr.id === '6' || mgr.id === '4') {
                result.push({ source: '5', target: targetId });
            }
            return result;
        });


        setOrgData({ nodes, edges });
    }, [mgrList]);


    return (
        <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1, minWidth: '0' }}>
                <Card title={`상태별 통계 (${chartedData.length}건)`}>
                    <StatPieChart type={type} chartedData={chartedData} />
                </Card>
            </div>
            <div style={{ flex: 1, minWidth: '0' }}>
            {type !== 'work' ? (
                <Card title={`날짜별 통계`}>
                    <StatLineChart chatList={chatList}/>
                </Card>
            ) : (
                <Card title={`조직도`}>
                    <StatDeptChart orgData={orgData} />
                </Card>
            )}
            </div>
        </div>
    );
};

export default StatContent;
