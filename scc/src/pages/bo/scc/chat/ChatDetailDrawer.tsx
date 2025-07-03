import {Drawer, Button, Typography, Descriptions} from 'antd';
import { useChatDetail } from '@pages/bo/scc/chat/useChat.ts';
import { useNavigate } from 'react-router-dom';
import { useMenuListStore, useMenuStore } from '@pages/bo/base/menu/menuStore.ts';
import ChatDetail from "@pages/bo/scc/chat/ChatDetail.tsx";

interface ChatDetailDrawerProps {
    chatSeq: string | null;
    open: boolean;
    onClose: () => void;
}
const { Text } = Typography;

const ChatDetailDrawer = ({ chatSeq, open, onClose }: ChatDetailDrawerProps) => {
    const navigate = useNavigate();
    const { setMenuCd } = useMenuStore();
    const menuList = useMenuListStore.getState().menuList;
    const { data: chatDetail } = useChatDetail(chatSeq ?? '');

    const handleGoDetail = () => {
        // 1. history 메뉴 찾기
        const menu = menuList.find(m => m.path === '/history');
        if (menu) {
            setMenuCd(menu.menuCd);
        }

        // 2. chatSeq 넘기며 이동
        navigate(`/history?chatSeq=${chatSeq}`);
        // navigate(`/history`);
    };

    return (
        <Drawer
            title="상담 상세"
            open={open}
            onClose={onClose}
            getContainer={false}
            extra={
                <>
                    <Button onClick={handleGoDetail}>자세히</Button>
                    <Button onClick={onClose}>닫기</Button>
                </>
            }
        >
            <ChatDetail chatDetail={chatDetail} />
        </Drawer>
    );
};

export default ChatDetailDrawer;