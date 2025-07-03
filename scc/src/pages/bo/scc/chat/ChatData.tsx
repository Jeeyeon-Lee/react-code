import {Card, Descriptions} from 'antd';
import { useUserDetail } from "@pages/bo/base/user/useUser.ts";


const ChatData = ({userId}) => {
    const {data: userDetail} = useUserDetail(userId ?? '');

    return (
        <Card title="고객 정보" style={{ height: '100%', overflow: 'auto' }}>
            <Descriptions
                bordered
                column={2}
                items={[
                    { key: 'title', label: '이용자 아이디', span: 2, children: userDetail?.userId || '-' },
                    { key: 'user', label: '이름', span: 2, children: userDetail?.userNm || '-' },
                    { key: 'mgr', label: '연락처', span: 2, children: userDetail?.mobile || '-' },
                ]}
            />

        </Card>
    );
};

export default ChatData;