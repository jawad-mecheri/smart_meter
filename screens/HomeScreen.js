import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View,Image,ScrollView } from 'react-native';
import { auth, db } from '../firebase';
import { useNavigation } from '@react-navigation/core';
import { doc, onSnapshot } from 'firebase/firestore';
import { FontAwesome, AntDesign,MaterialCommunityIcons } from '@expo/vector-icons';
import  WeatherIcon  from '../src/weathericon';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { requestNotificationPermission, scheduleLocalNotification } from '../notifications';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { Chart, VerticalAxis, HorizontalAxis, Line } from 'react-native-responsive-linechart'




const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const navigation = useNavigation();
  //API meteo
  const fetchWeatherData = async () => {
    try {

      if (!userData) {
        return;
      }
  
      const apiKey = '68c3b8459e55675ebe73d04e72ecffdc';
      const cityName = userData.city || 'Paris'; 
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=fr`);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }; 
  
  useEffect(() => {
    if (auth.currentUser && userData) {
      fetchWeatherData(userData.city);
    }
  }, [userData]);
  
  

  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = setupUserDataListener();
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    fetchWeatherData();
  }, []);
 

  const setupUserDataListener = () => {
    const userRef = doc(db, 'users', auth.currentUser.uid);

    const unsubscribe = onSnapshot(userRef, (userSnap) => {
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        console.log('No user data found');
      }
    }, (error) => {
      console.error('Error listening to user data:', error);
    });

    return unsubscribe;
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  }; 
 
  const calculatePercentageChange = (data) => {
  const percentageChange = [0];
  for (let i = 1; i < data.length; i++) {
    percentageChange.push(((data[i] - data[i - 1]) / data[i - 1]) * 100);
  }
  return percentageChange;
};
 
  const data = {
    labels: ['25s', '20s', '15s', '10s', '5s', 'now'],
    datasets: [ 
      {
        data: userData && userData.consumption ? userData.consumption : [],
        strokeWidth: 1, // optional
      },
    ],    
  };
  

  
  const chartConfig = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#1E90FF',
    backgroundGradientTo: '#4a7196',
    yAxisMinValue: 0,
    decimalPlaces: 3, // optional, defaults to 2dp
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

  const userConsumption = userData && userData.consumption ? userData.consumption : [];
  const dataLabels = ['25s', '20s', '15s', '10s', '5s', 'now'];
  let maxConsumption = Math.max(...userConsumption);
  
  // Adjust this according to your needs
  if(maxConsumption === -Infinity) maxConsumption = 0; 
  
  const formattedData = userConsumption.map((value, index) => ({x: index, y: value}));
  


  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const airQuality = userData && userData.airQuality ? userData.airQuality : 0;
    scheduleLocalNotification(airQuality);
  }, [userData]);
  
  return (userData && weatherData &&
    <ScrollView style={styles.container}>
    {/* Header */} 
    <View style={styles.header}>
  <View>
    <MaterialCommunityIcons name="home" size={40} color="#fff" />
  </View>
  <View style={styles.headerText}>
    <Text style={styles.headerTitle}>Bienvenue, {userData.firstName || '?'}!</Text>
    <Text style={styles.headerMessage}>Vous avez consommé 5 % de moins ce mois-ci.</Text>
  </View>
</View>
 
    {/* Weather */} 
    <View style={styles.weather}>
      <View style={styles.weatherContainer}>
      {weatherData.weather[0].icon && <WeatherIcon icon={weatherData.weather[0].icon} />}

        {/* <FontAwesome name="sun-o" size={48} color="#1E90FF" style={styles.weatherIcon} /> */}
        <View style={styles.weatherInfo}>
          <Text style={styles.weatherDate}>
            {new Date(weatherData.dt * 1000).toLocaleDateString('fr-FR')}, {userData.city || '?'}
          </Text>
          <Text style={styles.weatherTemp}>
            {weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1)}
          </Text> 
        </View>
      </View> 
      <View style={styles.infoContainer}>
        <View style={styles.info}>
          <FontAwesome name="thermometer-half" size={24} color="#808080" style={styles.infoIcon} />
          <Text style={styles.infoTitle}>Intérieure</Text>
          <Text style={styles.infoValue}>{userData.temperature || '?'}°C</Text>
        </View>
        <View style={styles.info}>
          <FontAwesome name="thermometer-half" size={24} color="#808080" style={styles.infoIcon} />
          <Text style={styles.infoTitle}>Extérieure</Text>
          <Text style={styles.infoValue}>{Math.round(weatherData.main.temp)}°C</Text>
        </View>
        <View style={styles.info}>
          <FontAwesome name="thermometer-half" size={24} color="#808080" style={styles.infoIcon} />
          <Text style={styles.infoTitle}>Idéale</Text>
          <Text style={styles.infoValue}>22°C</Text>
        </View> 
      </View>
    </View>

    {/* Air Quality */}
    <View style={styles.airQuality}>
      <View style={styles.airQualityIcon}>
      <FontAwesome name="cloud" size={30} color="#fff" />
      </View>
      <View style={styles.airQualityInfo}>
        <Text style={styles.airQualityTitle}>Qualité de l'air</Text>
        <Text style={styles.airQualityValue}>{userData.airQuality || '?'} AQI</Text>
      </View>
    </View>
    

    {/* Electricity */}
    <View style={styles.electricity}>
      <Text style={styles.electricityTitle}>Consommation électrique journalière</Text>
      <Text style={styles.electricityValue}>  {userData.energyCounter || '?'} <Text style={styles.electricityUnity}>mWh</Text></Text>
      <View style={[styles.electricityChart, { height: 200 }]}>
      {/* <LineChart
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
    /> */}
      <Chart
    style={{ height: 200, width: '100%', backgroundColor: '#eee' }}
    xDomain={{ min: 0, max: dataLabels.length - 1 }} // Set the domain based on your data length
    yDomain={{ min: 0, max: maxConsumption }}
    padding={{ left: 20, top: 10, bottom: 10, right: 10 }}
  >
    <VerticalAxis tickValues={[0, maxConsumption/4, maxConsumption/2, (3*maxConsumption)/4, maxConsumption]} />
    <HorizontalAxis tickValues={dataLabels.map((label, index) => index)} />
    <Line data={formattedData} smoothing="cubic-spline" theme={{ stroke: { color: 'blue', width: 1 } }} />
  </Chart>




</View>


      <View style={styles.electricityInfo}>
        <View style={styles.electricityInfoItem}>
          <Text style={styles.electricityInfoTitle}>Consommation de la semaine </Text>
          <Text style={styles.electricityInfoValue}>234.4 kWh</Text>
        </View>
        <View style={styles.electricityInfoItem}>
          <Text style={styles.electricityInfoTitle}>Consommation du mois</Text>
          <Text style={styles.electricityInfoValue}>1239.7 KWh</Text>
        </View>
      </View>
    </View>
    <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Se deconnnecter</Text>
      </TouchableOpacity>
  </ScrollView>

  
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
   
  },
  header: {
    backgroundColor: '#1E90FF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    height:100,
    },
  profileImage: {
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    overflow: 'hidden',
    top:20,

    },
  image: {
    width: 50,
    height: 50,

  },
  headerText: {
    flex: 1,
    //top:20,
    margin:10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerMessage: {
    color: '#fff',
    fontSize: 14,
    },
  iconsContainer: {
    flexDirection: 'row',
    bottom:20,
    },
  icon: {
    marginLeft: 20,
    },
    
  weather: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    marginBottom: 20,
    right:80,
  },
  weatherIcon: {
    marginRight: 10,
  },
  weatherInfo: {
    marginLeft:10,
    flexDirection: 'column',
  },
  weatherDate: {
    color: '#808080',
    fontSize: 14,
    marginBottom: 5,
  },
  weatherTemp: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  airQuality: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    marginTop: 0,
  },
  airQualityIcon: {
    backgroundColor: 'green',
    borderRadius: 50,
    overflow: 'hidden',
    marginRight: 10,
    padding: 10,
    elevation: 5,
  },
  airQualityInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  airQualityTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  airQualityValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    //flex: 1,
    
    width:250,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    color:'#1E90FF',
    alignItems: 'center',
  },
  infoIcon: {
    color:'#1E90FF',
    marginBottom: 5,
  },
  infoTitle: {
    color: '#808080',
    fontSize: 12,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  electricity: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
    marginTop: 0,
  },
  electricityTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  electricityValue: {
    alignItems: 'center',
    width :'100%',
    fontSize: 64,
    // fontWeight: 'bold',
    marginBottom: 20,
   // marginLeft:80,
  },
  electricityUnity:{
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#1E90FF',
  },
  electricityChart: {
    height: 200,
    width: '100%',
    // backgroundColor: '#eee',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:10,
  },
  electricityInfo: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  },
  electricityInfoTitle: {
  fontSize: 12,
  },
  electricityInfoValue: {
  fontSize: 16,
  fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
    
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});

