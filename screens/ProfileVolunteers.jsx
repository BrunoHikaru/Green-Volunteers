import React, { useState, useCallback } from 'react';
import { Text, View, Image, ActivityIndicator, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { auth, firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';

const Profile_empresas = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.error('Nenhum documento encontrado para o usuário');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar os dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleLogout = () => {
    auth.signOut();
    navigation.navigate('Login');
  };

  const handleUpdate = (newData) => {
    setUserData(newData);
  };

  return (
    <View style={styles.container}>
      {userData ? (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(20) }}>
            <Image
              source={{ uri: userData.photoURL }}
              style={styles.profileImage}
            />
            <Text style={styles.titles}>Nome:</Text>
            <Text style={{ ...styles.campos, marginLeft: hp(5) }}>{userData.name}</Text>

            <Text style={styles.titles}>Email:</Text>
            <View style={styles.row}>
              <MaterialIcons name="email" size={17} color="black" />
              <Text style={styles.campos}>{userData.email}</Text>
            </View>

            <Text style={styles.titles}>Telemóvel:</Text>
            <View style={styles.row}>
              <FontAwesome name="phone" size={17} color="black" />
              <Text style={styles.campos}>{userData.phone}</Text>
            </View>

            <Text style={styles.titles}>Endereço:</Text>
            <View style={styles.row}>
              <Entypo name="location-pin" size={17} color="black" />
              <Text style={styles.campos}>{userData.headquarters}</Text>
            </View>

            <Text style={styles.titles}>Objeto Social:</Text>
            <View style={styles.row}>
              <FontAwesome5 name="money-bill-wave" size={17} color="black" />
              <Text style={styles.campos}>{userData.socialObject}</Text>
            </View>

            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile', { userData, onUpdate: handleUpdate })}>
              <Text style={styles.editText}>Editar Informações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      ) : (
        <Text>Erro ao carregar os dados do usuário</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: hp(2),
  },
  profileImage: {
    width: wp(70),
    height: hp(25),
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: hp(7),
    marginBottom: hp(3),
    borderWidth: hp(0.3),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginHorizontal: hp(5),
  },
  titles: {
    fontWeight: 'bold',
    marginTop: hp(1.5),
    fontSize: Platform.OS === 'android' ? RFPercentage(3) : RFPercentage(3) + Platform.OS === 'ios' ? RFPercentage(2) : RFPercentage(2),
    marginHorizontal: hp(5),
    fontSize: Platform.OS === 'ios' ? RFPercentage(2.2) : RFPercentage(2.1) + Platform.OS === 'android' ? RFPercentage(3) : RFPercentage(3),
    marginBottom: hp(1.7)
  },
  campos: {
    fontSize: Platform.OS === 'ios' ? RFPercentage(2) : RFPercentage(2) + Platform.OS === 'android' ? RFPercentage(2) : RFPercentage(2.5),
    marginLeft: hp(1)
  },
  logoutButton: {
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: hp(4.7),
    backgroundColor: 'red',
    width: wp(75),
    marginTop: hp(5),
    height: hp(4)
  },
  logoutText: {
    color: 'white',
    textAlign: 'center',
    fontSize: Platform.OS === 'ios' ? RFPercentage(2.1) : RFPercentage(2.1) + Platform.OS === 'android' ? RFPercentage(3) : RFPercentage(3),
    marginVertical: Platform.OS === 'ios' ? hp(0.5) : hp(0.5) + Platform.OS === 'android' ? hp(-0.5) : hp(-0.5),
  },
  editButton: {
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: hp(4.7),
    backgroundColor: 'gray',
    width: wp(75),
    marginTop: hp(5),
    height: hp(4)
  },
  editText: {
    color: 'white',
    textAlign: 'center',
    fontSize: Platform.OS === 'ios' ? RFPercentage(2.1) : RFPercentage(2.1) + Platform.OS === 'android' ? RFPercentage(3) : RFPercentage(3),
    marginVertical: Platform.OS === 'ios' ? hp(0.5) : hp(0.5) + Platform.OS === 'android' ? hp(-0.5) : hp(-0.5),
  }
});

export default Profile_empresas;
