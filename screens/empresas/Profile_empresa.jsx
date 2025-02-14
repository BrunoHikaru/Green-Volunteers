import React, { useState, useCallback } from 'react';
import { Text, View, Image, ActivityIndicator, StatusBar, StyleSheet, Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { auth, firestore } from '../../firebase';
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

  const handleLogout = async () => {
    Alert.alert(
      "Confirmar Logout", 
      "Tem certeza de que deseja fazer logout?", 
      [
        {
          text: "Cancelar", 
          style: "cancel"  
        },
        {
          text: "Sim", 
          onPress: async () => {
            try {
              await auth.signOut();
              console.log('Logout realizado com sucesso!');
              navigation.replace('Comeco'); 
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
            }
          }
        }
      ],
      { cancelable: true } 
    );
  };

  const handleUpdate = (newData) => {
    setUserData(newData);
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza de que deseja excluir a conta?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sim",
          onPress: async () => {
            try {
              const user = auth.currentUser;
  
              
              if (user) {
                const firestore = getFirestore(); 
  
                
                await deleteDoc(doc(firestore, 'users', user.uid));
  
                
                await user.delete();
  
                
                navigation.replace('Comeco');
                console.log('Conta excluída com sucesso!');
              }
            } catch (error) {
              console.error('Erro ao deletar conta:', error);
  
             
              if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                  'Erro',
                  'Você precisa se autenticar novamente para deletar sua conta. Faça logout e faça login novamente antes de tentar.'
                );
              }
            }
          }
        }
      ],
      { cancelable: true }
    );
  };
  

  return (
    <View style={styles.container}>
      {userData ? (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(1) }}>
          <Image
              source={
                userData.photoURL
                  ? { uri: userData.photoURL } 
                  : require('../../assets/profile.png') 
              }
              style={styles.profileImage}
            />
            <Text style={styles.titles}>Nome:</Text>
            <View style={styles.row}>
              <FontAwesome name="user" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{userData.name ? userData.name : 'Adicionar um nome'}</Text>
            </View>

            <Text style={styles.titles}>Email:</Text>
            <View style={styles.row}>
              <MaterialIcons name="email" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{userData.email ? userData.email : 'Adicionar um email'}</Text>
            </View>

            <Text style={styles.titles}>Telemóvel:</Text>
            <View style={styles.row}>
              <FontAwesome name="phone" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{userData.phone ? userData.phone : 'Adicionar um telemóvel'}</Text>
            </View>

            <Text style={styles.titles}>Endereço:</Text>
            <View style={styles.row}>
              <Entypo name="location-pin" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{userData.headquarters ? userData.headquarters : 'Adicionar um endereço'}</Text>
            </View>

            <Text style={styles.titles}>Objeto Social:</Text>
            <View style={styles.row}>
              <FontAwesome5 name="money-bill-wave" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{userData.socialObject ? userData.socialObject : 'Adicionar um endereço'}</Text>
            </View>


            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile', { userData })}>
              <Text style={styles.editText}>Editar Informações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>

            
            <TouchableOpacity style={styles.logoutButton} onPress={handleDelete}>
              <Text style={styles.logoutText}>Apagar Conta</Text>
            </TouchableOpacity>
            <StatusBar/>
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
    paddingTop: hp(2.5),
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
    marginHorizontal: hp(3),
    marginBottom: hp(3),
  },
  titles: {
    fontWeight: 'bold',
    marginTop: hp(1.5),
    fontSize: Platform.OS === 'android' ? RFPercentage(2.2) : RFPercentage(2.2) + Platform.OS === 'ios' ? RFPercentage(2.2) : RFPercentage(2.2),
    marginHorizontal: hp(1),
    marginBottom: hp(1.5)
  },
  campos: {
    fontSize: Platform.OS === 'ios' ? RFPercentage(2) : RFPercentage(2) + Platform.OS === 'android' ? RFPercentage(2) : RFPercentage(2),
    marginLeft: hp(1)
  },
  logoutButton: {
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
    marginHorizontal: hp(4.3),
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
    justifyContent: 'center',
    marginHorizontal: hp(4.3),
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
