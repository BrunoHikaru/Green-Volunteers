import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HomeVolunteers from '.././Voluntario/HomeVolunteers';
import MyVolunteeringScreen from '.././Voluntario/MyVolunteeringScreen';
import ProfileVolunteers from '.././Voluntario/ProfileVolunteers';
import ComecoScreen from '../ComecoScreen';
import LoginScreen from '../LoginScreen';
import RegisterScreen from '../RegisterScreen';
import RegisterCompanyScreen from '../RegisterCompanyScreen';
import Convidado_Menu from '../Convidado_Menu';
import Guest_menuStack from '../stacks/Guest_menuStack';
import Oquee from '../Oquee';


const Tab = createBottomTabNavigator();

export default function GuestTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#3d8a0c',
                tabBarInactiveTintColor: '#666',
                tabBarStyle: { display: 'none' }  
            }}
        >
            <Tab.Screen 
                name="ComecoConvidadoScreen" 
                component={ComecoScreen} 
                options={{ 
                    headerShown: false, 
                    tabBarButton: () => null, 
                    tabBarIcon: ({ color, size }) => (<FontAwesome name="home" size={size} color={color} />) 
                }} 
            />
            <Tab.Screen 
                name="Convidado_Menu" 
                component={Guest_menuStack} 
                options={{ 
                    headerShown: false,
                    tabBarButton: () => null 
                }} 
            />
            <Tab.Screen 
                name="Login" 
                component={LoginScreen} 
                options={{ 
                    headerShown: false,
                    tabBarButton: () => null 
                }} 
            />
            <Tab.Screen 
                name="Register" 
                component={RegisterScreen} 
                options={{ 
                    headerShown: false,
                    tabBarButton: () => null 
                }} 
            />
            <Tab.Screen 
                name="RegisterCompany" 
                component={RegisterCompanyScreen} 
                options={{ 
                    headerShown: false,
                    tabBarButton: () => null 
                }} 
            />
            <Tab.Screen 
                name="Informação" 
                component={Oquee} 
                options={{ 
                    headerShown: false,
                    tabBarButton: () => null 
                }} 
            />
        </Tab.Navigator>
    );
}
