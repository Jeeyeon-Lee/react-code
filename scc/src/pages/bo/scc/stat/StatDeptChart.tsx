import React from 'react';
import {OrganizationChart, RCNode, type OrganizationChartOptions} from "@ant-design/graphs";

const { OrganizationChartNode } = RCNode;

const StatDeptChart = ({orgData}) => {
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
        behaviors: ['level-of-detail'],
    };
    return (
        <OrganizationChart {...orgConfig} height={300} />
    );
}

export default StatDeptChart;