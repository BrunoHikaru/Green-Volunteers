import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import HomeVolunteers from '.././Voluntario/HomeVolunteers';
import MyVolunteeringScreen from '.././Voluntario/MyVolunteeringScreen';
import vol_profileStack from '../stacks/Vol_profileStack';
import Vol_communityStack from '../stacks/Vol_communityStack'
import Entypo from '@expo/vector-icons/Entypo';
import Vol_homeStack from '../stacks/Vol_homeStack';
import Vol_myprojectStack from '../stacks/Vol_myprojectStack';

const Tab = createBottomTabNavigator();

export default function VolunteerTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#3d8a0c',
      tabBarInactiveTintColor: '#666'}}>
      <Tab.Screen name="Home" component={Vol_homeStack} options={{headerShown:false, tabBarIcon:({color,size})=>(<FontAwesome name="home" size={size} color={color} />)}}/>
      <Tab.Screen name="Meus voluntariados" component={Vol_myprojectStack} options={{headerShown:false, tabBarIcon:({color,size})=>(<FontAwesome5 name="hands-helping" size={size} color={color} />)}}/>
      <Tab.Screen name="Comunidade" component={Vol_communityStack} options={{headerShown:false, tabBarIcon:({color,size})=>(<Entypo name="chat" size={size} color={color} />)}}/>   
      <Tab.Screen name="Perfil" component={vol_profileStack} options={{headerShown:false, tabBarIcon:({color,size})=>(<FontAwesome name="user" size={size} color={color} />)}}/>   
    </Tab.Navigator>
  );
}
