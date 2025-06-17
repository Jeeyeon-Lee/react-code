import { Tag } from 'antd';

interface TagProps {
    color?: string;
    children: React.ReactNode;
}

const CmmTag = ({ color, children }: TagProps) => {

    return (
        <Tag color={color} style={{margin:"3px"}}>
            {children}
        </Tag>
    );
};

export default CmmTag;
