import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Perfil_empresas from '../empresas/Profile_empresa';
import EditProfile from '../empresas/EditProfile';
import AdminProjectScreen from '../Administrador/AdminProjectScreen';
import DetalhesProj from '../Administrador/DetalhesProj';
import HomeAdmin from '../Administrador/HomeAdmin';
import GerirUsers from '../Administrador/GerirUsers';

const Stack = createStackNavigator();

function Adm_homeStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={HomeAdmin} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Gerir Utilizadores" 
        component={GerirUsers} 
        options={{ headerShown: true }} 
      />
      <Stack.Screen 
        name="Gerir Projetos" 
        component={AdminProjectScreen} 
        options={{ headerShown: true }} 
      />
      
    </Stack.Navigator>
  );
}

export default Adm_homeStack;