import React from "react";
import { Collapse, Card, Divider, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface Props {
    title?: string;
    button?: string | 'none';
    children: React.ReactNode;
}

function CmmCollapseCard({ title = '검색', button = '검색', children }: Props) {
    const items = [
        {
            key: '1',
            label: title,
            children: <>{children}</>,
            extra: button !== 'none' ? (
                <Button type="primary" htmlType="submit">
                    <SearchOutlined /> {button}
                </Button>
            ) : null
        }
    ];

    return (
        <div>
            <Card>
                <Collapse defaultActiveKey={['1']} items={items} />
            </Card>
            <Divider />
        </div>
    );
}

export default CmmCollapseCard;
