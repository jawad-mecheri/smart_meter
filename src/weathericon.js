import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet} from 'react-native';
const WeatherIcon = ({ icon }) => {
  const iconName = getWeatherIcon(icon);

  return <MaterialCommunityIcons name={iconName} size={48} color="#1E90FF"  />;
};

const getWeatherIcon = (icon) => {
  switch (icon) {
    case '01d':
    case '01n':
      return 'weather-sunny';
    case '02d':
    case '02n':
      return 'weather-partly-cloudy';
    case '03d':
    case '03n':
    case '04d': 
    case '04n':
      return 'weather-cloudy';
    case '09d':
    case '09n':
      return 'weather-rainy';
    case '10d':
    case '10n':
      return 'weather-pouring';
    case '11d':
    case '11n':
      return 'weather-lightning';
    case '13d':
    case '13n':
      return 'weather-snowy';
    case '50d':
    case '50n':
      return 'weather-fog';
    default:
      return 'weather-fog';
  }
};
export default WeatherIcon;
