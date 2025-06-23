import {Typography, Space, Select, message} from 'antd';
import type { Mgr, Login, Chat } from '@/types';
import { useChatStore } from '@stores/bo/scc/chat/chatStore.ts';
import { useUserStore } from '@stores/bo/base/user/userStore.ts';
import { useLogin, useSaveLoginMgrMutation } from '@hooks/cmm/login/useLogin.ts';
import { useChatDetail } from '@hooks/bo/scc/chat/useChat.ts';
import { useUser } from '@hooks/bo/base/user/useUser.ts';
import { useMgrList, useUpdateMgrStatusMutation} from '@hooks/bo/base/mgr/useMgr.ts';
import CmmCodeSelect from "@components/form/CmmCodeSelect.tsx";
import { useSocketDetail, updateSocketStatusMutation } from '@hooks/cmm/socket/useSocket.ts';

const { Text } = Typography;

function ChatHeader() {
    const { chatSeq, clearChatSeq} = useChatStore();
    const { userId, setUserId } = useUserStore();

    const { useUserDetail } = useUser();
    const { data: userDetail } = useUserDetail(userId);
    const { loginInfo } = useLogin();
    const { mutate: saveLoginMgr } = useSaveLoginMgrMutation();
    const { mutate: updateLoginStatus } = useUpdateMgrStatusMutation();
    const { data: mgrList } = useMgrList();
    const { mutate: updateSocketStatus } = updateSocketStatusMutation();
    const { data: socketDetail } = useSocketDetail();


    const handleLoginStatusUpdate = (status:Login['status']) => {
        if (!loginInfo || socketDetail?.[0].status !== 'open') {
            message.error('소켓이 연결된 상태가 아닙니다.');
            return;
        }
        updateLoginStatus({ loginInfo, status });
    }
    const handleSocketStatusUpdate = (status:string) => {
        updateSocketStatus(status);
    }
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
                    {/*상태, 총 통화, 평균통화, 전체콜, 본인콜, 전체채팅, 전체콜*/}
                </div>
                <div>
                    {loginInfo && (
                        <div style={{ position:'relative', right: 10 }} >
                            <Text strong>{loginInfo.mgrNm}(상태 : {loginInfo.status})</Text>
                            <Space.Compact style={{ position: 'relative', marginLeft: 10 }} size="large">
                                <Select
                                    value={loginInfo.mgrNm}
                                    showSearch
                                    prefix="로그인 :  "
                                    style={{width: 200, textAlign:'center'}}
                                    onChange={(mgrId:Mgr['mgrId']) => {
                                        if (mgrId) {
                                            if (!loginInfo || socketDetail?.status !== 'open') {
                                                message.error('소켓이 연결된 상태가 아닙니다.');
                                                return;
                                            }
                                            saveLoginMgr(mgrId);
                                        }
                                    }}
                                    placeholder="담당자 선택"
                                    optionFilterProp="label"
                                    options={mgrList?.map((mgr) => ({
                                        label: `${mgr.mgrNm}`,
                                        value: mgr.id,
                                        disabled: mgr.status === '휴가',
                                    }))}
                                >
                                </Select>
                                <CmmCodeSelect
                                    group='직원상태'
                                    all={false}
                                    value={loginInfo.status}
                                    showSearch
                                    prefix="상태:"
                                    style={{width: 150, textAlign:'center'}}
                                    onChange={(status:Mgr['status']) => {
                                        if (status) {
                                            handleLoginStatusUpdate(status);
                                        }
                                    }}
                                >
                                </CmmCodeSelect>
                                <CmmCodeSelect
                                    group='소켓상태'
                                    all={false}
                                    value={socketDetail?.[0].status}
                                    prefix="소켓:  "
                                    style={{width: 150, textAlign:'center'}}
                                    onChange={(status) => {
                                        if (status) {
                                            handleSocketStatusUpdate(status);
                                        }
                                    }}
                                />
                            </Space.Compact>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatHeader;
