import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Perfil_voluntarios from '../Voluntario/ProfileVolunteers';
import EditProfileVolScreen from '../Voluntario/EditProfileVol';
import HomeVolunteers from '../Voluntario/HomeVolunteers';
import Detalhes_projetos from '../Voluntario/Detalhes_projetos'
import Detalhes_noticias from '../Voluntario/Detalhes_noticias'
import TodosProjetos from '../Voluntario/TodosProjetos';
import TodasNoticias from '../Voluntario/TodasNoticias';

const Stack = createStackNavigator();

function Vol_homeStack() {
  return (
    <Stack.Navigator initialRouteName="Home" >
      <Stack.Screen
        name="Home"
      component = {HomeVolunteers}
      options = {{ headerShown: false }
      } 
      />
      < Stack.Screen
        name="Detalhes_projetos"
        component={Detalhes_projetos}
        options={{ headerShown: true, title:'Detalhes'}}
      />
      < Stack.Screen
        name="Detalhes_noticias"
        component={Detalhes_noticias}
        options={{ headerShown: true, title:'Notícia'}}
      />
      
    
      < Stack.Screen
        name="TodosProjetos"
        component={TodosProjetos}
        options={{ headerShown: false}}
      />
      < Stack.Screen
        name="TodasNoticias"
        component={TodasNoticias}
        options={{ headerShown: false}}
      />
      
    
      
      

    </Stack.Navigator>
  );
}

export default Vol_homeStack;
