import { Typography, Space, Select, Carousel } from 'antd';
import type {Mgr, Login, Bbs} from '@pages/cmm';
import {Navigate, useNavigate} from "react-router-dom";
import { useLogin, useSaveLoginMgrMutation } from '@pages/cmm/login/useLogin.ts';
import { useMgrList } from '@pages/bo/base/mgr/useMgr.ts';
import CmmCodeSelect from "@components/form/CmmCodeSelect.tsx";
import { useSocketDetail, updateSocketStatusMutation, useUpdateMgrStatusMutation } from "@pages/cmm/cti/useCti.ts";
import ChatStatusChangeButton from "@pages/bo/scc/chat/ChatStatusChangeButton.tsx";
import { useChatStore } from '@pages/bo/scc/chat/chatStore.ts';
import { useCtiStore } from '@pages/cmm/cti/ctiStore.ts';
import CallStatusChangeButton from "@pages/bo/scc/chat/CallStatusChangeButton.tsx";
import {useBbsList} from "@pages/bo/base/bbs/core/useBbs.ts";
import {useMenuListStore, useMenuStore} from "@pages/bo/base/menu/menuStore";

const { Text } = Typography;

function ChatHeader() {
    const { chatType } = useChatStore();
    const { setMgrStatus } = useCtiStore();
    const navigate = useNavigate();
    const { setMenuCd } = useMenuStore();
    const menuList = useMenuListStore.getState().menuList;
    const { loginInfo} = useLogin();
    const {mutate: saveLoginMgr} = useSaveLoginMgrMutation();
    const {mutate: updateLoginStatus} = useUpdateMgrStatusMutation();
    const {data: mgrList} = useMgrList();
    const { data: bbsList } = useBbsList('');
    const {mutate: updateSocketStatus} = updateSocketStatusMutation();
    const {data: socketDetail} = useSocketDetail();

    const handleLoginStatusUpdate = async (status: Login['status']) => {
        await updateLoginStatus({loginInfo, status});// DB 상태
        setMgrStatus(status); //ctiStoreT상태
    };

    const handleSocketStatusUpdate = (status: string) => {
        updateSocketStatus(status);
    };
    const handleGoDetail = (bbsSeq) => {
        // 1. history 메뉴 찾기
        const menu = menuList.find(m => m.path === '/bbs/core/1000');
        if (menu) {
            setMenuCd(menu.menuCd);
        }

        // 2. chatSeq 넘기며 이동
        navigate(`/bbs/core/1000?bbsSeq=${bbsSeq}`);
        // navigate(`/history`);
    };

    const contentStyle: React.CSSProperties = {
        margin: 0,
        height: '40px',
        lineHeight: '40px',
        padding: '0 10px',
        color: '#000',
        textAlign: 'left',
        background: '#f5f5f5',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center', // 수직 정렬
    };


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
                {/* 캐러셀 영역*/}
                <div style={{ flex: 1, maxWidth: 500, margin: '0 16px' }}>
                    {bbsList && bbsList.length > 0 && (
                        <Carousel
                            arrows={true}
                            infinite={true}
                            dots={false}
                        >
                            {bbsList.map((bbsItem: Bbs) => (
                                <div key={bbsItem.id}>
                                    <div
                                        onClick={() => handleGoDetail(bbsItem.bbsSeq)}
                                        style={{
                                            height: 40,
                                            lineHeight: '40px',
                                            padding: '0 12px',
                                            background: '#f0f2f5',
                                            fontSize: '14px',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        📢 {bbsItem.title}
                                    </div>
                                </div>
                            ))}
                        </Carousel>
                    )}
                </div>
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
