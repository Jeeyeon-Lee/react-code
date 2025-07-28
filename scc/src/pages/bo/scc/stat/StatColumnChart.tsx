import { Column } from '@ant-design/plots';


const StatColumnChart = ({chatList}) => {
    const columnData = chatList.reduce((acc, cur) => {
        const date = cur?.regDt?.split(" ")[0];
        const status = cur?.status || '기타';
        if (date && status) {
            const key = `${date}_${status}`;
            acc[key] = (acc[key] || { date, status, count: 0 });
            acc[key].count += 1;
        }
        return acc;
    }, {} as Record<string, { date: string; status: string; count: number }>);

    const chartData = Object.values(columnData);
    const dateSumMap: Record<string, number> = {};

    chartData.forEach(({ date, count }) => {
        dateSumMap[date] = (dateSumMap[date] || 0) + count;
    });

    const maxCount = Math.max(...Object.values(dateSumMap));

    const columnConfig = {
        data: chartData ?? [],
        xField: 'date',
        yField: 'count',
        scale: {
            y: {
                domain: [0,maxCount],
            },
        },
        colorField: 'status',
        stack: true,
        label: {
            text: 'count',
            position: 'top',
            style: {
                fill: '#fff',
                fontSize: 12,
                position: 'top',
                textAlign: 'center',
            },
        },
        style: {
            radiusTopLeft: 10,
            radiusTopRight: 10,
            minWidth: 8,
        },
        interaction: {
            tooltip: {
                render: (e, { title, items }) => {
                    return (
                        <div key={title}>
                            <h4>{title}</h4>
                            {items.map((item) => {
                                const { name, value, color } = item;
                                return (
                                    <div style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: '50%',
                                                    backgroundColor: color,
                                                    marginRight: 6,
                                                }}
                                            ></span>
                                            <span>{name}</span>
                                        </div>
                                        <b>{value}</b>
                                    </div>
                                );
                            })}
                        </div>
                    );
                },
            },
            elementHighlight: true,
        },
        animate:{
            enter:{
                type:'scaleInY',
            }
        }
    };


    return (
        <Column {...columnConfig} height={300} />
    )
}


export default StatColumnChart;