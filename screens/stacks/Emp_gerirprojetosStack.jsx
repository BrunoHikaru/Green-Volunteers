import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Gerir_projetos from '../empresas/Gerir_projetos';
import Visualizar_candidaturas from '../empresas/Visualizar_candidaturas';

const Stack = createStackNavigator();

function Emp_gerirprojetosStack() {
  return (
    <Stack.Navigator initialRouteName="Gerir_projetos">
      <Stack.Screen 
        name="Gerir_projetos" 
        component={Gerir_projetos} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Visualizar_candidaturas" 
        component={Visualizar_candidaturas} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}

export default Emp_gerirprojetosStack;
