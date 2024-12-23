import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const NotificationsUrgentes = ({ notifications }) => {
  const notificationsUrgentes = notifications.filter(n => n.type === 'urgent');
  const notificationsTrie = notificationsUrgentes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <ScrollView style={styles.container}>
      {notificationsTrie.map(notification => renderNotification(notification))}
    </ScrollView>
  );
};

const NotificationsInfos = ({ notifications }) => {
  const notificationsInfos = notifications.filter(n => n.type === 'info');
  const notificationsTrie = notificationsInfos.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <ScrollView style={styles.container}>
      {notificationsTrie.map(notification => renderNotification(notification))}
    </ScrollView>
  );
};

const renderNotification = (notification) => {
  const { type, title, message, timestamp } = notification;
  const isUrgent = type === 'urgent';
  const timeString = timestamp.toLocaleString();

  return (
    <View key={notification.id} style={[styles.notification, isUrgent ? styles.urgent : styles.info]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.timestamp}>{timeString}</Text>
    </View>
  );
};

const EcranNotifications = () => {
  const notifications = [
    {
      id: '1',
      type: 'urgent',
      title: 'Alerte de consommation élevée',
      message: 'Une consommation élevée a été détectée dans votre foyer.',
      timestamp: new Date('2023-05-27T14:30:00'),
    },
    {
      id: '2',
      type: 'info',
      title: 'Mise à jour du système',
      message: 'Votre système a été mis à jour avec succès.',
      timestamp: new Date('2023-05-26T16:00:00'),
    },
    {
      id: '3',
      type: 'urgent',
      title: 'Détection de gaz inflammable',
      message: 'Une concentration élevée de gaz inflammable a été détectée dans votre maison.',
      timestamp: new Date('2023-05-26T10:30:00'),
    },
    {
      id: '4',
      type: 'info',
      title: 'Qualité de l\'air',
      message: 'La qualité de l\'air est actuellement excellente.',
      timestamp: new Date('2023-05-25T17:00:00'),
    },
    {
      id: '5',
      type: 'urgent',
      title: 'Température élevée',
      message: 'La température dans votre maison est très élevée. Veuillez vérifier votre système de climatisation.',
      timestamp: new Date('2023-05-25T14:00:00'),
    },
    {
      id: '8',
      type: 'info',
      title: 'Humidité',
      message: 'Le taux d\'humidité dans votre maison est optimal.',
      timestamp: new Date('2023-05-24T15:30:00'),
    },
    {
      id: '11',
      type: 'urgent',
      title: 'Surcharge de l\'alimentation électrique',
      message: 'Une surcharge a été détectée dans votre système électrique. Veuillez vérifier.',
      timestamp: new Date('2023-05-23T12:30:00'),
    },
    {
      id: '14',
      type: 'info',
      title: 'Rapport de consommation d\'énergie',
      message: 'Votre consommation d\'énergie ce mois-ci est dans la moyenne.',
      timestamp: new Date('2023-05-22T16:30:00'),
    },
    {
      id: '15',
      type: 'urgent',
      title: 'Mauvaise qualité de l\'air',
      message: 'La qualité de l\'air est dangereusement mauvaise. Veuillez prendre des mesures.',
      timestamp: new Date('2023-05-22T14:00:00'),
    },
  ];
  
  
  
  
  

  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({ 
        tabBarStyle: { 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          elevation: 0, 
          shadowOpacity: 0, 
          borderBottomWidth: StyleSheet.hairlineWidth,
          backgroundColor: 'white', // Changement de la couleur de la barre de navigation
          paddingTop: 1, 
          height:50,
        },
        tabBarActiveTintColor: '#007BFF', // couleur du tab actif
        tabBarInactiveTintColor: '#888', // couleur du tab inactif
        tabBarLabelStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Urgent') {
            iconName = focused ? 'ios-warning' : 'ios-warning-outline'; // Choix d'icônes pour "Urgent"
          } else if (route.name === 'Info') {
            iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline'; // Choix d'icônes pour "Info"
          }

          // Vous pouvez retourner n'importe quel composant ici!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false 
      })}
    >
      <Tab.Screen name="Urgent">
        {props => <NotificationsUrgentes {...props} notifications={notifications} />}
      </Tab.Screen>
      <Tab.Screen name="Info">
        {props => <NotificationsInfos {...props} notifications={notifications} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginTop: 50, 
  },
  notification: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 1,
  },
  urgent: {
    borderColor: 'red',
  },
  info: {
    borderColor: '#1E90FF',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#808080',
  },
  tabBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default EcranNotifications;
