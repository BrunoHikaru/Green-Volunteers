import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Perfil_empresas from '../empresas/Profile_empresa';
import Home_empresas from '../empresas/Home_empresas';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Emp_MyProjectsStack from '../stacks/Emp_myProjectsStack';
import EditProfile from '../empresas/EditProfile';
import Emp_profileStack from '../stacks/Emp_profileStack';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import Vol_communityStack from '../stacks/Vol_communityStack'
import Emp_homeStack from '../stacks/Emp_homeStack';



const Tab = createBottomTabNavigator();

export default function CompanyTabs() {

  return (
    <Tab.Navigator initialRouteName='Home' screenOptions={{ tabBarActiveTintColor: '#3d8a0c',
      tabBarInactiveTintColor: '#666' }}>
      <Tab.Screen name="Home" component={Emp_homeStack} options={{headerShown:false, tabBarIcon:({color,size})=>(<FontAwesome name="home" size={size} color={color} />)}}/>
      <Tab.Screen name="Meus projetos" component={Emp_MyProjectsStack} options={{headerShown:false, tabBarIcon:({color,size})=>(<FontAwesome5 name="hands-helping" size={size} color={color} />)}}/>
      <Tab.Screen name="Comunidade" component={Vol_communityStack} options={{headerShown:false, tabBarIcon:({color,size})=>(<Entypo name="chat" size={size} color={color} />)}}/>   
      <Tab.Screen name="Perfil" component={Emp_profileStack} options={{headerShown:false, tabBarIcon:({color,size})=>(<FontAwesome name="user" size={size} color={color} />)}}/>
    </Tab.Navigator>
  );
}
