import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Perfil_voluntarios from '../Voluntario/ProfileVolunteers';
import EditProfileVol from '../Voluntario/EditProfileVol';
import CommunityScreen from '../Voluntario/CommunityScreen';
import ChatScreen from '../Voluntario/ChatScreen';
import { TouchableOpacity,Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import GroupChatScreen from '../Voluntario/GroupChatScreen';
import CreateGroupScreen from '../Voluntario/CreateGroupScreen';

const Stack = createStackNavigator();

function vol_profileStack() {
    return (
        <Stack.Navigator initialRouteName="Comunidade">
            <Stack.Screen
                name="Comunidade"
                component={CommunityScreen}
                options={{ headerShown: false }} 
            />
            <Stack.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={({ route, navigation }) => ({
                  headerTitle: route.params.userName, 
                  headerTitleAlign: 'center', 
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
                      <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                  ),
                  headerRight: () => (
                    <Image
                      source={route.params.userImage ? { uri: route.params.userImage } : require('../../assets/profile.png')}
                      style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10, marginBottom:5, borderWidth:1 }}
                    />
                  ),
                })}
            />
            <Stack.Screen
                name="GroupChatScreen"
                component={GroupChatScreen}
                options={({ route, navigation }) => ({
                  headerTitle: route.params.groupName, 
                  headerTitleAlign: 'center', 
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
                      <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                  ),
                  headerRight: () => (
                    <Image
                      source={route.params.userImage ? { uri: route.params.userImage } : require('../../assets/profile.png')}
                      style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10, marginBottom:5, borderWidth:1 }}
                    />
                  ),
                })}
            />
            <Stack.Screen
                name="CreateGroupScreen"
                component={CreateGroupScreen}
                options={{ headerShown: false }} 
            />
        </Stack.Navigator>
    );
}

export default vol_profileStack;

