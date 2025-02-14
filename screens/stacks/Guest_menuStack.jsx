import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Perfil_empresas from '../empresas/Profile_empresa';
import EditProfile from '../empresas/EditProfile';
import Convidado_Menu from '../Convidado_Menu'
import LoginScreen from '../LoginScreen'
import RegisterScreen from '../RegisterScreen';
import RegisterCompanyScreen from '../RegisterCompanyScreen'


const Stack = createStackNavigator();

function Guest_menuStack() {
  return (
    <Stack.Navigator initialRouteName="Convidado_Menu">
      <Stack.Screen 
        name="Convidado_MenuScreen" 
        component={Convidado_Menu} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ headerShown: false}} 
      />
      <Stack.Screen 
        name="RegisterCompany" 
        component={RegisterCompanyScreen} 
        options={{ headerShown: false}} 
      />
    </Stack.Navigator>
  );
}

export default Guest_menuStack;
