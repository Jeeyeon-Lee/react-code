import { Pie } from '@ant-design/charts';

const StatPieChart = ({type, chartedData}) => {
    const pieGrouped = chartedData.reduce((acc: { [x: string]: any; }, cur: { status: string | number; }) => {
        acc[cur.status] = (acc[cur.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(pieGrouped).map(([status, count]) => ({
        type: status,
        count,
    }));

    const pieConfig = {
        data: pieData,
        angleField: 'count',
        colorField: 'type',
        innerRadius: 0.5,
        label: {
            text: 'type',
        },
        legend: false,
        tooltip: {
            title: 'type',
        },
        interaction: {
            elementHighlight: true,
        },
        state: {
            inactive: { opacity: 0.5 },
        },
        annotations: [
            {
                type: 'text',
                style: {
                    text: type !== 'work' ? '채팅 상태' : '직원 상태',
                    x: '50%',
                    y: '50%',
                    textAlign: 'center',
                    fontSize: 20,
                    fontStyle: 'bold',
                },
            },
        ],
        animate:{
            enter:{
                type:'fadeIn',
            }
        }
    };

    return (
        <Pie {...pieConfig} height={300} />
    )
}

export default StatPieChart;