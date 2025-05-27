import React from 'react';
import { Col, Steps, Button, message } from 'antd';
import { theme } from 'antd';

interface RightContentProps {
    selectedNav: string;
}

const RightContent: React.FC<RightContentProps> = ({ selectedNav }) => {
    const { token: { colorTextTertiary, colorFillAlter, borderRadiusLG, colorBorder } } = theme.useToken();
    const [current, setCurrent] = React.useState(0);
    const [leftTime, setLeftTime] = React.useState(0);
    const steps = [
        {
            title: 'First',
            content: 'First-content',
        },
        {
            title: 'Second',
            content: 'Second-content',
            subTitle: '남은시간 :'+ {leftTime},
        },
        {
            title: 'Last',
            content: 'Last-content',
        },
    ];

    const next = () => setCurrent(current + 1);
    const prev = () => setCurrent(current - 1);

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: colorTextTertiary,
        backgroundColor: colorFillAlter,
        borderRadius: borderRadiusLG,
        border: `1px dashed ${colorBorder}`,
        marginTop: 16,
    };

    return (
        <Col span={12} style={{ background: '#eee6bf', padding: '16px', height: '80vh' }}>
            <Steps current={current} items={items} direction="vertical" />
            <div style={contentStyle}>{steps[current].content}</div>
            <div style={{ marginTop: 24 }}>
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={next}>
                        Next
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button
                        type="primary"
                        onClick={() => message.success('Processing complete!')}
                    >
                        Done
                    </Button>
                )}
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={prev}>
                        Previous
                    </Button>
                )}
            </div>
        </Col>
    );
};

export default RightContent; 