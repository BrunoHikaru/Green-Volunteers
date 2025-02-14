import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Perfil_empresas from '../empresas/Profile_empresa';
import EditProfile from '../empresas/EditProfile';
import AdminProjectScreen from '../Administrador/AdminProjectScreen';
import DetalhesProj from '../Administrador/DetalhesProj';
import GerirUsers from '../Administrador/GerirUsers';
import criarUser from '../Administrador/CriarUser'

const Stack = createStackNavigator();

function Adm_userStack() {
  return (
    <Stack.Navigator initialRouteName="Gerir Utilizadores">
      <Stack.Screen 
        name="Gerir Utilizadores" 
        component={GerirUsers} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Criar Utilizador" 
        component={criarUser} 
        options={{ headerShown: true }} 
      />
    </Stack.Navigator>
  );
}

export default Adm_userStack;