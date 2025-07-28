import React, {useState} from 'react';
import {OrganizationChart, RCNode, type OrganizationChartOptions} from "@ant-design/graphs";
import { Button, Drawer, theme, Space } from 'antd';

const { OrganizationChartNode } = RCNode;

const StatDeptChart = ({orgData}) => {
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const { token } = theme.useToken();
    const [open, setOpen] = useState(false);

    const onClose = () => {
        setOpen(false);
    };
    const containerStyle: React.CSSProperties = {
        position: 'relative',
        overflow: 'hidden',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
    };

    const handleReady = (graph: { on: (arg0: string, arg1: (evt: any) => void) => void; getElementData: (arg0: any) => any; }) => {
        graph.on('node:click', (evt) => {
            const id = evt.target?.get?.('id');
            if (!id && evt.target.type !== 'node') return;

            const elementData = graph.getElementData(id);

            if (elementData?.data) {
                setSelectedNode(elementData.data);
                setOpen(true);
            }
        });
    };

    const orgConfig: OrganizationChartOptions = {
        autoFit: 'view',
        data: orgData,
        node: {
            style: {
                component: (d) => {
                    const { name, position, status } = d.data || {};
                    return <OrganizationChartNode name={name} position={position} status={status} />;
                },
                size: [240, 80],
            },
        },
        edge: {
            style: {
                radius: 16,
                lineWidth: 2,
                endArrow: true,
            },
        },
        layout: {
            type: 'dagre',
            rankdir: 'TB', // 기본: 위 → 아래
            nodesep: 40,
            ranksep: 80,
            marginx: 20,
            marginy: 20,
        },
        animate:{
            enter:{
                type:'fadeIn',
            }
        },
        onReady: ({ chart }) => {
            try {
                chart.on('afterrender', () => {
                    console.error(e);
                });
            } catch (e) {
                console.error(e);
            }
        },
    // behaviors: [],
    };
    return (
        <>
            <div style={containerStyle}>
                <OrganizationChart {...orgConfig} height={300} onReady={handleReady} />
                <Drawer
                    title="상세정보"
                    placement="right"
                    closable={{ 'aria-label': 'Close Button' }}
                    onClose={onClose}
                    open={open}
                    getContainer={false}
                >
                    {selectedNode && (
                        <>
                            <p><b>아이디:</b> {selectedNode?.id}</p>
                            <p><b>이름:</b> {selectedNode?.name}</p>
                            <p><b>직책:</b> {selectedNode?.position}</p>
                            <p><b>상태:</b> {selectedNode?.status}</p>
                            <p><b>연락처:</b> {selectedNode?.phone}</p>
                        </>
                    )}
                </Drawer>
            </div>
        </>
    );
}

export default StatDeptChart;