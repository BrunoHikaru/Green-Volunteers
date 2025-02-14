import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Perfil_voluntarios from '../Voluntario/ProfileVolunteers';
import EditProfileVolScreen from '../Voluntario/EditProfileVol';

const Stack = createStackNavigator();

function Vol_profileStack() {
  return (
    <Stack.Navigator initialRouteName="Perfil_voluntarios" >
      <Stack.Screen
        name="Perfil_voluntarios"
      component = {Perfil_voluntarios}
      options = {{ headerShown: false }
      } 
      />
      < Stack.Screen
        name="EditProfileVol"
        component={EditProfileVolScreen}
        options={{ headerShown: true, title: 'Editar Perfil' }}
      />
      
    
      
      

    </Stack.Navigator>
  );
}

export default Vol_profileStack;
