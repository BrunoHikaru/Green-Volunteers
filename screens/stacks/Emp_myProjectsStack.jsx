import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MeusProjetos from '../empresas/MyProjectsScreen';
import CreateProjectScreen from '../empresas/CreateProjectScreen';
import Gerir_projetos from '../empresas/Gerir_projetos';
import EditProjectScreen from '../empresas/EditProjectScreen'

const Stack = createStackNavigator();

function Emp_myProjectsStack() {
  return (
    <Stack.Navigator initialRouteName="MeusProjetos" >
      <Stack.Screen
        name="MeusProjetos"
        component = {MeusProjetos}
        options = {{ headerShown: false }
      } 
      />
      < Stack.Screen
        name="CreateProjectScreen"
        component={CreateProjectScreen}
        options={{ headerShown: true, title: 'Criar Projeto' }}
      />
      < Stack.Screen
        name="Gerir_projetos"
        component={Gerir_projetos}
        options={{ headerShown: false}}
      />
      < Stack.Screen
        name="EditProjectScreen"
        component={EditProjectScreen}
        options={{ headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default Emp_myProjectsStack;
