import React, { useState } from 'react';
import { Text, Image, View, TextInput, StyleSheet, Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { auth, firestore } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const EditProfile = ({ navigation, route }) => {
  const { userData } = route.params;

  const [photoURL, setImage] = useState(userData.photoURL || '');
  const [name, setName] = useState(userData.name || '');
  const [phone, setPhone] = useState(userData.phone || '');
  const [headquarters, setHeadquarters] = useState(userData.headquarters || '');
  const [socialObject, setSocialObject] = useState(userData.socialObject || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !phone || !headquarters || !socialObject) {
      
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.', [{ text: 'OK' }]);
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);

        await updateDoc(userDocRef, {
          photoURL,
          name,
          phone,
          headquarters,
          socialObject,
        });



        alert('Informações atualizadas com sucesso!');
        navigation.goBack(); 
      }
    } catch (error) {
      console.error('Erro ao atualizar as informações do usuário:', error);
      alert('Erro ao atualizar as informações. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
  
     
      if (!result.canceled) {
        const selectedImageUri = result.assets[0].uri;
  
        
        const storage = getStorage();
        const user = auth.currentUser;
        const imageRef = ref(storage, `profilePictures/${user.uid}.jpg`); 
  
      
        const response = await fetch(selectedImageUri);
        const blob = await response.blob();
  
        
        await uploadBytes(imageRef, blob);
  
        
        const downloadURL = await getDownloadURL(imageRef);
  
        
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, {
          photoURL: downloadURL, 
        });
  
        
        setImage(downloadURL);
      }
    } catch (error) {
      console.error('Erro ao selecionar ou atualizar imagem:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={
            photoURL 
              ? { uri: photoURL } 
              : require('../../assets/profile.png') 
          }
          style={styles.profileImage}
          onError={() => setImage('')} 
        />

        <TouchableOpacity onPress={handleImagePick} style={styles.regButton}>
          <Text style={styles.buttonText}>Escolher Foto de Perfil</Text>
        </TouchableOpacity>

        <Text style={{marginBottom:hp(2.3),marginTop:hp(-1), textAlign:'right', marginRight:wp(10), color:'red'}}>* Campos Obrigatórios</Text>

        <Text style={styles.label}>* Nome:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Digite seu nome"
        />

        <Text style={styles.label}>* Telemóvel:</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Digite seu telemóvel"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>* Endereço:</Text>
        <TextInput
          style={styles.input}
          value={headquarters}
          onChangeText={setHeadquarters}
          placeholder="Digite seu endereço"
        />

        <Text style={styles.label}>* Objeto Social:</Text>
        <TextInput
          style={styles.input}
          value={socialObject}
          onChangeText={setSocialObject}
          placeholder="Digite seu objeto social"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveText}>{loading ? 'Salvando...' : 'Salvar'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: hp(2),
  },
  label: {
    fontWeight: 'bold',
    fontSize: RFPercentage(2.2),
    marginHorizontal: hp(5),
    marginTop: hp(2),
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
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: hp(1.5),
    fontSize: RFPercentage(2),
    marginHorizontal: hp(5),
    marginTop: hp(1),
  },
  saveButton: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: 'blue',
    width: wp(75),
    alignSelf: 'center',
    marginTop: hp(5),
    height: hp(6),
    justifyContent: 'center',
  },
  regButton: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 7,
    alignItems: 'center',
    backgroundColor: '#3D550C',
    width: wp(70),
    marginHorizontal: wp(10),
    marginBottom: hp(5),
  },
  saveText: {
    color: 'white',
    textAlign: 'center',
    fontSize: RFPercentage(2.5),
  },
});

export default EditProfile;
