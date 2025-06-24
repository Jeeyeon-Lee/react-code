import { Typography, Space, Select, message, Badge } from 'antd';
import type { Mgr, Login } from '@/types';
import { useLogin, useSaveLoginMgrMutation } from '@hooks/cmm/login/useLogin.ts';
import { useMgrList, useUpdateMgrStatusMutation } from '@hooks/bo/base/mgr/useMgr.ts';
import CmmCodeSelect from "@components/form/CmmCodeSelect.tsx";
import { useSocketDetail, updateSocketStatusMutation } from '@hooks/cmm/socket/useSocket.ts';
import ChatStatusChangeButton from "@pages/bo/scc/chat/ChatStatusChangeButton.tsx";
import {useChatList} from "@hooks/bo/scc/chat/useChat.ts";

const { Text } = Typography;

function ChatHeader() {
    const {loginInfo} = useLogin();
    const {mutate: saveLoginMgr} = useSaveLoginMgrMutation();
    const {mutate: updateLoginStatus} = useUpdateMgrStatusMutation();
    const {data: mgrList} = useMgrList();
    const {mutate: updateSocketStatus} = updateSocketStatusMutation();
    const {data: socketDetail} = useSocketDetail();
    const { data: chatList = []} = useChatList({mgrId:loginInfo?.mgrId ?? '', status:'대기중', type:'all'});

    const handleLoginStatusUpdate = (status: Login['status']) => {
        if (socketDetail?.status !== 'open') {
            message.error('소켓이 연결된 상태가 아닙니다.');
            return;
        }
        updateLoginStatus({loginInfo, status});
    }

    const handleSocketStatusUpdate = (status: string) => {
        updateSocketStatus(status);
    }

    return (
        <div
            style={{
                padding: '5px 5px',
                borderBottom: '1px solid #e0e0e0',
                background: '#fff',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                }}
            >
                {/* 왼쪽 통계 영역 */}
                <div style={{display: 'flex', flexWrap: 'wrap', rowGap: 12}}>
                    {[
                        {label: '상담 대기중', value: <Badge count={chatList?.length} style={{backgroundColor: '#f5222d'}}/>},
                        {label: '총 통화', value: '00:00:00'},
                        {label: '평균통화', value: '00:00:00'},
                        {label: '상담대기', value: '00:00:00'},
                        {label: '후처리', value: '00:00:00'},
                        {label: '자리비움', value: '00:00:00'},
                        {label: '전체콜', value: '0/0'},
                        {label: '평균콜', value: '0/0'},
                        {label: '본인콜', value: '0/0'},
                    ].map((item, idx) => (
                        <div key={idx} style={{width: 100, textAlign: 'center', marginRight: 5}}>
                            <div style={{fontSize: 14, fontWeight: 500, color: '#333'}}>{item.label}</div>
                            <div style={{fontSize: 16, fontWeight: 700}}>{item.value}</div>
                        </div>
                    ))}
                </div>

                {/* 오른쪽 담당자/상태 영역 */}
                <div>
                    {loginInfo && (
                        <div style={{position: 'relative', right: 10}}>
                            <Text strong>{loginInfo.mgrNm}(상태 : {loginInfo.status})</Text>
                            <Space.Compact style={{marginLeft: '16px'}} size="middle">
                                <Select
                                    value={loginInfo.mgrNm}
                                    style={{width: 140}}
                                    onChange={(mgrId: Mgr['mgrId']) => {
                                        if (!loginInfo || socketDetail?.status !== 'open') {
                                            message.error('소켓이 연결된 상태가 아닙니다.');
                                            return;
                                        }
                                        saveLoginMgr(mgrId);
                                    }}
                                    options={mgrList?.map((mgr) => ({
                                        label: mgr.mgrNm,
                                        value: mgr.id,
                                        disabled: mgr.status === '휴가',
                                    }))}
                                />
                                <CmmCodeSelect
                                    group="직원상태"
                                    all={false}
                                    value={loginInfo.status}
                                    style={{width: 120}}
                                    onChange={(status: Mgr['status']) => {
                                        if (status) handleLoginStatusUpdate(status);
                                    }}
                                />
                                <CmmCodeSelect
                                    group="소켓상태"
                                    all={false}
                                    value={socketDetail?.status}
                                    style={{width: 100}}
                                    onChange={(status) => {
                                        if (status) handleSocketStatusUpdate(status);
                                    }}
                                />
                            </Space.Compact>
                        </div>
                    )}
                </div>
            </div>

            {/* 하단: 버튼 (왼쪽만) */}
            <div style={{marginTop: 8}}>
                <ChatStatusChangeButton/>
            </div>
        </div>
    );
}

export default ChatHeader;
