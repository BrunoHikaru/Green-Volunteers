import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeAdmin from '../Administrador/HomeAdmin';
import AdminProjectScreen from '../Administrador/AdminProjectScreen';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Adm_projStack from '../stacks/Adm_projStack';
import Octicons from '@expo/vector-icons/Octicons';
import CriarNoticias from '../Administrador/CriarNoticias';
import Entypo from '@expo/vector-icons/Entypo';
import GerirUsers from '../Administrador/GerirUsers';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Adm_userStack from '../stacks/Adm_userStack';
import Adm_homeStack from '../stacks/Adm_homeStack';


const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  return (
    <Tab.Navigator initialRouteName='Home' screenOptions={{ tabBarActiveTintColor: '#3d8a0c',
      tabBarInactiveTintColor: '#666'}}>
      <Tab.Screen name="Home" component={Adm_homeStack} options={{headerShown:false, tabBarIcon:({color,size})=>(<FontAwesome name="home" size={size} color={color} />)}}/>
      <Tab.Screen name="Criar Noticias" component={CriarNoticias} options={{headerShown:false, tabBarIcon:({color,size})=>(<Entypo name="news" size={size} color={color} />)}}/>
      <Tab.Screen name='Gerir Projetos' component={Adm_projStack} options={{headerShown:false,tabBarIcon:({color,size})=>(<Octicons name="project" size={size} color={color} />)}}/>
      <Tab.Screen name='Gerir Utilizadores' component={Adm_userStack} options={{headerShown:false,tabBarIcon:({color,size})=>(<MaterialIcons name="manage-accounts" size={size} color={color} />)}}/>
    </Tab.Navigator>
  );
}
