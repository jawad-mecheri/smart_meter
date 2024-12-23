import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const data = {
  labels: ['10h', '8h', '6H', '4h', '2h', '0h'],
  datasets: [
    {
      data: [0, 10, 30, 40, 50, 10],
      strokeWidth: 2, // optional
    },
  ],
};

const chartConfig = {
  backgroundColor: '#e26a00',
  backgroundGradientFrom: '#1E90FF',
  backgroundGradientTo: '#4a7196',
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

const LineChartExample = () => {
  return (
    <LineChart
      data={data}
      width={Dimensions.get('window').width - 60}
      height={220}
      yAxisLabel={''}
      chartConfig={chartConfig}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />
  );
};

export default LineChartExample;
