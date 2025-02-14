import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import VolunteerTabs from './screens/tabs/VolunteerTabs';
import CompanyTabs from './screens/tabs/CompanyTabs';
import AdminTabs from './screens/tabs/AdminTabs';

import GuestTabs from './screens/tabs/GuestTabs';
import { LogBox, StatusBar, Alert, Platform } from 'react-native';

import messaging from '@react-native-firebase/messaging'

const Stack = createStackNavigator();

// Ignorar logs de advertência do Firebase Auth
LogBox.ignoreLogs([/@firebase\/auth/]);

export default function App() {
  const requestUserPermission=async ()=>{
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() => {
    if(requestUserPermission()){
      messaging().getToken().then((token)=>{console.log(token)});
    }else {
      console.log("Permission not granted", authStatus)
    }

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const unsubscribe= messaging().onMessage(async(remoteMessage)=>{
      Alert.alert("Você tem uma nova notificação!", JSON.stringify(remoteMessage.notification.title))
    })

    return unsubscribe
  }, [])
 

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Comeco">
        <Stack.Screen name="Comeco" component={GuestTabs}  options={{headerShown:false}}/>
        <Stack.Screen name="Volunteer" component={VolunteerTabs}  options={{headerShown:false}}/>
        <Stack.Screen name="Company" component={CompanyTabs} options={{headerShown:false}}/>
        <Stack.Screen name="Admin" component={AdminTabs}  options={{headerShown:false}}/>
      </Stack.Navigator>
      <StatusBar barStyle='default'/>
    </NavigationContainer>
  );
}
