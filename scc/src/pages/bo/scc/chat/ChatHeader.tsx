import { Typography, Space, Select, message } from 'antd';
import type { Mgr, Login } from '@pages/cmm';
import { useLogin, useSaveLoginMgrMutation } from '@pages/cmm/login/useLogin.ts';
import { useMgrList } from '@pages/bo/base/mgr/useMgr.ts';
import CmmCodeSelect from "@components/form/CmmCodeSelect.tsx";
import { useSocketDetail, updateSocketStatusMutation, useUpdateMgrStatusMutation } from "@pages/cmm/cti/useCti.ts";
import ChatStatusChangeButton from "@pages/bo/scc/chat/ChatStatusChangeButton.tsx";
import { useChatStore } from '@pages/bo/scc/chat/chatStore.ts';
import { useCtiStore } from '@pages/cmm/cti/ctiStore.ts';
import CallStatusChangeButton from "@pages/bo/scc/chat/CallStatusChangeButton.tsx";

const { Text } = Typography;

function ChatHeader() {
    const { chatType } = useChatStore();
    const { setMgrStatus } = useCtiStore();
    const { loginInfo} = useLogin();
    const {mutate: saveLoginMgr} = useSaveLoginMgrMutation();
    const {mutate: updateLoginStatus} = useUpdateMgrStatusMutation();
    const {data: mgrList} = useMgrList();
    const {mutate: updateSocketStatus} = updateSocketStatusMutation();
    const {data: socketDetail} = useSocketDetail();

    const handleLoginStatusUpdate = async (status: Login['status']) => {
        await updateLoginStatus({loginInfo, status});// DB 상태
        setMgrStatus(status); //ctiStoreT상태
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
                minHeight: 40,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                }}
            >
                { chatType === '채팅'
                    ? <ChatStatusChangeButton/>
                    : <CallStatusChangeButton/>
                }
                {/* 오른쪽 담당자/상태 영역 */}
                {loginInfo && (
                    <div style={{right: 10}}>
                        <Text strong>{loginInfo.mgrNm}(상태 : {loginInfo.status})</Text>
                        <Space.Compact style={{marginLeft: '16px'}} size="middle">
                            <Select
                                value={loginInfo.mgrNm}
                                style={{width: 140}}
                                onChange={async (mgrId: Mgr['mgrId']) => {
                                    await saveLoginMgr(mgrId);
                                    await updateLoginStatus(loginInfo, '대기');
                                }}
                                options={mgrList?.map((mgr) => ({
                                    label: mgr.mgrNm,
                                    value: mgr.id,
                                    disabled: mgr.status === '휴가',
                                }))}
                            />
                            <CmmCodeSelect
                                group="AGENT_STATUS"
                                all={false}
                                value={loginInfo.status}
                                style={{width: 120}}
                                onChange={(status: Mgr['status']) => {
                                    handleLoginStatusUpdate(status);
                                }}
                            />
                            <CmmCodeSelect
                                group="SOCKET_STATUS"
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
    );
}

export default ChatHeader;
