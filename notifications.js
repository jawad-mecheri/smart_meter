import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  if (status !== 'granted') {
    Alert.alert('Permission refusée', "L'application n'a pas la permission d'afficher des notifications.");
    return false;
  }

  return true;
};

export const scheduleLocalNotification = async (airQuality) => {
  if (airQuality > 300) {
    console.log("hey")
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Alerte Qualité de l\'air',
        body: `La qualité de l'air est critique : ${airQuality} AQI. Prenez des précautions.`,
        sound: 'default',
        priority: 'high',
      },
      trigger: {
        seconds: 1,
      },
      ios: {
        // Configurer la présentation de la notification sur iOS
        presentationOptions: [
          'alert', // Afficher une alerte en haut de l'écran
          'sound', // Jouer un son
          'badge', // Mettre à jour le badge de l'application
        ],
      },
    });
  }
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
