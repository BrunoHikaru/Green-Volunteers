import React, { useState, useCallback } from 'react';
import { Text, View, Image, ActivityIndicator, StatusBar, StyleSheet, Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { auth, firestore } from '../../firebase';
import { doc, getDoc, deleteDoc, getFirestore} from 'firebase/firestore';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Entypo from '@expo/vector-icons/Entypo';
import Foundation from '@expo/vector-icons/Foundation';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useFocusEffect } from '@react-navigation/native';
import { color } from 'react-native-elements/dist/helpers';
import * as WebBrowser from 'expo-web-browser';


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

  const estado_civil_check = () => {
    if (!userData.estado_civil) return 'Adicionar um estado civil'
    if (userData.estado_civil === 'null' || userData.estado_civil === '') return 'Nenhum'
    return userData.estado_civil
  }

  const nif_check = () => {
    if (userData.nif === 'null' || userData.nif === '') return 'Nenhum'
    if (!userData.nif) return 'Adicionar um NIF'
    return userData.nif
  }

  const calcularIdade = () => {
    if (!userData.birthdate) return null; 

    const hoje = new Date();
    const nascimento = new Date(userData.birthdate);

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade + ' anos de idade';
  };

  const openResume = async () => {
    if (userData.resumeURL) {
      try {
        await WebBrowser.openBrowserAsync(userData.resumeURL);
      } catch (error) {
        console.error('Erro ao abrir o currículo:', error);
      }
    } else {
      Alert.alert("Currículo", "Nenhum currículo disponível.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

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

            <Text style={styles.titles}>Idade:</Text>
            <View style={styles.row}>
              <FontAwesome6 name="calendar-days" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{calcularIdade()}</Text>
            </View>

            <Text style={styles.titles}>Gênero:</Text>
            <View style={styles.row}>
              <FontAwesome name="genderless" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{userData.gender ? userData.gender : 'Adicionar um gênero'}</Text>
            </View>

            <Text style={styles.titles}>Email:</Text>
            <View style={styles.row}>
              <MaterialIcons name="email" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{userData.email ? userData.email : 'Adicionar um email'}</Text>
            </View>

            <Text style={styles.titles}>Telemóvel:</Text>
            <View style={styles.row}>
              <FontAwesome name="phone" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{userData.phoneNumber ? userData.phoneNumber : 'Adicionar um telemóvel'}</Text>
            </View>

            <Text style={styles.titles}>Restrições ou deficiências:</Text>
            <View style={styles.row}>
              <FontAwesome6 name="pills" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{userData.deficiencias ? userData.deficiencias : 'Adicionar uma restrição'}</Text>
            </View>

            <Text style={styles.titles}>Endereço:</Text>
            <View style={styles.row}>
              <Entypo name="location-pin" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{userData.endereco ? userData.endereco : 'Adicionar um endereço'}</Text>
            </View>

            <Text style={styles.titles}>Profissão:</Text>
            <View style={styles.row}>
              <Entypo name="suitcase" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{userData.profissao ? userData.profissao : 'Adicionar uma profissão'}</Text>
            </View>

            <Text style={styles.titles}>Estado civil:</Text>
            <View style={styles.row}>
              <Ionicons name="people" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{estado_civil_check()}</Text>
            </View>

            <Text style={styles.titles}>NIF:</Text>
            <View style={styles.row}>
              <Entypo name="document-landscape" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{nif_check()}</Text>
            </View>

            <Text style={styles.titles}>Habilidades especiais:</Text>
            <View style={styles.row}>
              <Foundation name="sheriff-badge" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{userData.habilidades ? userData.habilidades : 'Adicionar uma habilidade especial'}</Text>
            </View>

            <Text style={styles.titles}>Biografia:</Text>
            <View style={styles.row}>
              <MaterialIcons name="description" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{userData.biografia ? userData.biografia : 'Adicionar uma biografia'}</Text>
            </View>

            <Text style={styles.titles}>Interesses e disponibilidade:</Text>
            <View style={styles.row}>
              <MaterialCommunityIcons name="progress-clock" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{userData.interesses ? userData.interesses : 'Adicionar um interesse e disponibilidade'}</Text>
            </View>

            <Text style={styles.titles}>Currículo:</Text>
            <TouchableOpacity style={styles.row} onPress={openResume}>
              <Entypo name="text-document-inverted" size={17} color="black" style={{ alignSelf: 'flex-start', marginTop: 0 }}/>
              <Text style={{ ...styles.campos }}>{userData.resumeURL ? 'Abrir currículo' : 'Adicionar um currículo'}</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfileVol', { userData })}>
              <Text style={styles.editText}>Editar Informações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.logoutButton} onPress={handleDelete}>
              <Text style={styles.logoutText}>Apagar Conta</Text>
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
    marginBottom: hp(3)
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
    marginLeft: hp(1),
  },
  logoutButton: {
    borderRadius: 5,
    borderWidth: 1,
    justifyContent:'center',
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
    justifyContent:'center',
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
  },
});

export default Profile_empresas;
