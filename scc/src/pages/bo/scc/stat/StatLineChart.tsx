import {Line} from '@ant-design/plots';


const StatLineChart = ({chatList}) => {
    const lineData = chatList.reduce((acc, cur) => {
        const date = cur?.regDt?.split(" ")[0]; // YYYY-MM-DD
        if (date) {
            acc[date] = (acc[date] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(lineData).map(([date, count]) => ({
        date,
        count,
    }));

    const lineConfig = {
        data: chartData ?? [],
        xField: 'date',
        yField: 'count',
        point: {shapeField: 'circle', sizeField: 5},
        style: {lineWidth: 2},
    };

    return (
        <Line {...lineConfig} height={300} />
    )
}


export default StatLineChart;