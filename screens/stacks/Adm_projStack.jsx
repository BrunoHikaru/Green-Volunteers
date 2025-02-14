import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Perfil_empresas from '../empresas/Profile_empresa';
import EditProfile from '../empresas/EditProfile';
import AdminProjectScreen from '../Administrador/AdminProjectScreen';
import DetalhesProj from '../Administrador/DetalhesProj';

const Stack = createStackNavigator();

function Adm_projStack() {
  return (
    <Stack.Navigator initialRouteName="Gerir Projetos">
      <Stack.Screen 
        name="Gerir Projetos" 
        component={AdminProjectScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Detalhes" 
        component={DetalhesProj} 
        options={{ headerShown: true }} 
      />
    </Stack.Navigator>
  );
}

export default Adm_projStack;