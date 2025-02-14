import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Perfil_empresasScreen from '../empresas/Profile_empresa';
import EditProfileScreen from '../empresas/EditProfile';
import Gerir_projetos from '../empresas/Gerir_projetos'
import Detalhes_noticias from '../Voluntario/Detalhes_noticias'
import Home_empresas from '../empresas/Home_empresas';
import Visualizar_candidaturas from '../empresas/Visualizar_candidaturas'
import Emp_gerirprojetosStack from '../stacks/Emp_gerirprojetosStack'
import EditProjectScreen from '../empresas/EditProjectScreen';
import TodasNoticias from '../Voluntario/TodasNoticias';
import TodosProjetos from '../Voluntario/TodosProjetos';


const Stack = createStackNavigator();

function Emp_homeStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={Home_empresas} 
        options={{ headerShown: false }} 
      />
       < Stack.Screen
        name="Gerir_projetos"
        component={Gerir_projetos}
        options={{ headerShown: false}}
      />
      <Stack.Screen 
        name="Detalhes_noticias" 
        component={Detalhes_noticias} 
        options={{ headerShown: true, title:'Notícias'}} 
      />
      < Stack.Screen
        name="EditProjectScreen"
        component={EditProjectScreen}
        options={{ headerShown: false}}
      />
      <Stack.Screen 
        name="Visualizar_candidaturas" 
        component={Visualizar_candidaturas} 
        options={{ headerShown: false }} 
      />
      < Stack.Screen
        name="TodasNoticias"
        component={TodasNoticias}
        options={{ headerShown: false}}
      />
      < Stack.Screen
        name="TodosProjetos"
        component={TodosProjetos}
        options={{ headerShown: false}}
      />
      
      
    </Stack.Navigator>
  );
}

export default Emp_homeStack;
