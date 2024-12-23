import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { LineChart, Grid } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

const ElectricityChart = () => {
  const [electricityData, setElectricityData] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToElectricityData();
    return () => unsubscribe();
  }, []);

  const listenToElectricityData = () => {
    const electricityDataRef = doc(db, 'electricityData', 'current');

    return onSnapshot(electricityDataRef, (electricityDataSnap) => {
      if (electricityDataSnap.exists()) {
        const data = electricityDataSnap.data().data || [];
        setElectricityData(data);
      } else {
        console.log('No electricity data found');
      }
    }, (error) => {
      console.error('Error listening to electricity data:', error);
    });
  };

  const chartData = {
    labels: ['10h', '8h', '6H', '4h', '2h', '0h'],
    datasets: [
      {
        data: electricityData,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#1E90FF',
    backgroundGradientTo: '#4a7196',
    decimalPlaces: 0,
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

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
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
    </View>
  );
};

export default ElectricityChart;
