import React, { useEffect, useState } from 'react'
import CustomPieChart from '../Charts/CustomPieChart'

const COLORS = ["#ADD8E6", "#90EE90", "#F08080", "#FFF5EE"];

const RecentIncomeWithChart = ({data, totalIncome}) => {

    const [chartData, setChartData] = useState([]);
    const prepareChartData = () => {
        const dataArr = data?.map((item) => ({
            name: item?.source,
            amount: item?.amount
        }));
        setChartData(dataArr);
    };

    useEffect(() => {
        prepareChartData();

        return () => {};
    }, [data]);

  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <h5 className='text-lg'>Last 60 days Income</h5>
        </div>

        <CustomPieChart 
            data={chartData}
            label="Total Income"
            totalAmount={`MMK ${totalIncome}`}
            showTextAnchor
            colors={COLORS}
        />
    </div>
  )
}

export default RecentIncomeWithChart
