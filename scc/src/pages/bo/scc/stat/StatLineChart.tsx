import { Line } from '@ant-design/plots';

const StatLineChart = ({ chatList }) => {
    const dates = [...new Set(chatList.map((c) => c.regDt?.split(' ')[0]))];
    const statuses = [...new Set(chatList.map((c) => c.status || '기타'))];

    const dataMap = new Map<string, { date: string; status: string; count: number }>();
    chatList.forEach((c) => {
        const date = c?.regDt?.split(' ')[0];
        const status = c?.status || '기타';
        const key = `${date}_${status}`;
        if (!dataMap.has(key)) {
            dataMap.set(key, { date, status, count: 0 });
        }
        dataMap.get(key)!.count += 1;
    });

    // 누락된 날짜+status 조합은 count=0으로 채움
    dates.forEach((date) => {
        statuses.forEach((status) => {
            const key = `${date}_${status}`;
            if (!dataMap.has(key)) {
                dataMap.set(key, { date, status, count: 0 });
            }
        });
    });

    const chartData = Array.from(dataMap.values()).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const lineConfig = {
        data: chartData,
        xField: 'date',
        axis: {
            x: {
                labelAutoRotate: false,
            },
        },
        yField: 'count',
        colorField: 'status',
        point: {
            shapeField: 'circle',
            sizeField: 5,
        },
        style: {
            lineWidth: 2,
        },
        height: 300,
        animate:{
            enter:{
                type:'growInX',
            }
        }
    };

    return <Line {...lineConfig} />;
};

export default StatLineChart;
