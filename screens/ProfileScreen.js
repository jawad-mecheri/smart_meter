import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Dimensions, 
} from 'react-native';
import { auth, db } from '../firebase';
import { useNavigation } from '@react-navigation/core';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
 // const [headerHeight, setHeaderHeight] = useState(new Animated.Value(150)); // Remplacez 150 par la hauteur initiale de votre header
  const [editMode, setEditMode] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = setupUserDataListener();
      return () => unsubscribe();
    }
  }, []);

  const setupUserDataListener = () => {
    const userRef = doc(db, 'users', auth.currentUser.uid);

    const unsubscribe = onSnapshot(userRef, (userSnap) => {
      if (userSnap.exists()) {
        const userData = userSnap.data();
        userData.smartMeterId = userSnap.id;
        setUserData(userData);
      } else {
        console.log('No user data found');
      }
    }, (error) => {
      console.error('Error listening to user data:', error);
    });

    return unsubscribe;
  };

  const [animationProgress, setAnimationProgress] = useState(new Animated.Value(0));


  const onEditProfilePress = () => {
    if (!editMode) {
      Animated.timing(animationProgress, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setEditMode(true);
    } else {
      Animated.timing(animationProgress, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setEditMode(false);
      updateUserData();
    }
  }; 

  const updateUserData = async () => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        city: userData.city,
      });
      console.log('User data updated successfully');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
  

  const screenHeight = Dimensions.get("window").height;
const headerHeight = animationProgress.interpolate({
  inputRange: [0, 1],
  outputRange: [200, screenHeight], // Remplacez 150 par la hauteur initiale de votre header
});

  
  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <View style={styles.profileInfo}>
          <Image source={require('../src/user.jpg')} style={styles.profileImage} />

          <View>
            <Text style={styles.name}>{userData?.firstName} {userData?.lastName}</Text>
            <Text style={styles.location}>{userData?.city}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editProfileButton} onPress={onEditProfilePress}>
          <Text style={styles.editProfileButtonText}>Editer le Profile</Text>
        </TouchableOpacity>

        {editMode && (
          <View style={styles.editProfileForm}>
              <TextInput
                style={styles.textInput}
                value={userData?.firstName}
                onChangeText={(text) => setUserData({ ...userData, firstName: text })}
                placeholder="Prénom"
              />
              <TextInput
                style={styles.textInput}
                value={userData?.lastName}
                onChangeText={(text) => setUserData({ ...userData, lastName: text })}
                placeholder="Nom"
              />
              <TextInput
                style={styles.textInput}
                value={userData?.city}
                onChangeText={(text) => setUserData({ ...userData, city: text })}
                placeholder="Ville"
              />
            </View>

        )}
      </Animated.View>
      <View style={styles.smartMeterInfo}>
        <Text style={styles.smartMeterTitle}>Information Smart Meter</Text>
        <Text style={styles.smartMeterId}>ID: {userData?.smartMeterId}</Text>
        {/* Environment sub-section */}
        <View style={styles.subSection}>
          <View style={styles.subSectionHeader}>
            <MaterialCommunityIcons style={styles.subSectionIcon} name="weather-partly-cloudy" size={24} />
            <Text style={styles.subSectionTitle}>Environnement</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Humidité: {userData?.humidity}%</Text>
            <Text style={styles.infoLabel}>Temperature: {userData?.temperature}°C</Text>
            <Text style={styles.infoLabel}>Qualité de l'air: {userData?.airQuality} AQI</Text>
          </View>
        </View>
        {/* Gas sub-section */}
        <View style={styles.subSection}>
          <View style={styles.subSectionHeader}>
          <FontAwesome5 style={styles.subSectionIcon} name="shield-alt" size={24} color="#FFA500" />
          <Text style={styles.subSectionTitle}>Sécurité</Text>

          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Gas: {userData?.inflammableGas} ppm</Text>
          </View>
        </View>
        {/* Electricity sub-section */}
        <View style={styles.subSection}>
          <View style={styles.subSectionHeader}>
            <MaterialIcons style={styles.subSectionIcon} name="bolt" size={24} />
            <Text style={styles.subSectionTitle}>Electricité</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Voltage: {userData?.voltage} V</Text>



            <Text style={styles.infoLabel}>Current: {userData?.current} A</Text>
            <Text style={styles.infoLabel}>Power: {userData?.power} W</Text>
            <Text style={styles.infoLabel}>Energy: {userData?.energy} kWh</Text>
          </View>
        </View>
      </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1E90FF',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  location: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  editProfileButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  editProfileButtonText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  editProfileForm: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  
 
  textInput: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 10,
    width:'70%',
    marginBottom:20,
  },
  
  smartMeterInfo: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  smartMeterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  smartMeterId: {
    marginBottom: 15,
    color: '#404040',
  },
  subSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  subSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subSectionIcon: {
    color: '#1E90FF',
    marginRight: 10,
  },
  subSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    width: '50%',
    marginBottom: 10,
  },
});

export default ProfileScreen;