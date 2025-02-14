import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Perfil_voluntarios from '../Voluntario/ProfileVolunteers';
import EditProfileVolScreen from '../Voluntario/EditProfileVol';
import HomeVolunteers from '../Voluntario/HomeVolunteers';
import Detalhes_projetos from '../Voluntario/Detalhes_projetos'
import Detalhes_noticias from '../Voluntario/Detalhes_noticias'
import MyVolunteeringScreen from '../Voluntario/MyVolunteeringScreen';
import Detalhes_myvolunteering from '../Voluntario/Detalhes_myvolunteering'


const Stack = createStackNavigator();

function Vol_myprojectStack() {
  return (
    <Stack.Navigator initialRouteName="Meus voluntariados" >
      <Stack.Screen
        name="Meus voluntariados"
      component = {MyVolunteeringScreen}
      options = {{ headerShown: false }
      } 
      />
      < Stack.Screen
        name="Detalhes_projetos"
        component={Detalhes_projetos}
        options={{ headerShown: true}}
      />
      < Stack.Screen
        name="Detalhes_myvolunteering"
        component={Detalhes_myvolunteering}
        options={{ headerShown: true, title:'Detalhes'}}
      />
      
      
      
    
      
      

    </Stack.Navigator>
  );
}

export default Vol_myprojectStack;
