import PushNotification from 'react-native-push-notification';

export default class NotificationManager {
  static configure() {
    PushNotification.configure({
      onNotification: function(notification) {
        console.log('Notification received: ', notification);
      },
    });
  }

  static localNotification({title, message}) {
    PushNotification.localNotification({
      title: title,
      message: message,
    });
  }
}
