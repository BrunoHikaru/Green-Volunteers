import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Perfil_empresasScreen from '../empresas/Profile_empresa';
import EditProfileScreen from '../empresas/EditProfile';

const Stack = createStackNavigator();

function Emp_profileStack() {
  return (
    <Stack.Navigator initialRouteName="Perfil_empresas">
      <Stack.Screen 
        name="Perfil_empresas" 
        component={Perfil_empresasScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ headerShown: true, title: 'Editar Perfil' }} 
      />
    </Stack.Navigator>
  );
}

export default Emp_profileStack;
