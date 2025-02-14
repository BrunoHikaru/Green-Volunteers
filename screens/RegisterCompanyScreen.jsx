import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, Platform, Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, firestore, storage } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Touchable } from 'react-native';

const RegisterCompanyScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [socialObject, setSocialObject] = useState('');
  const [headquarters, setHeadquarters] = useState('');
  const [phone, setPhone] = useState('');
  const [nipc, setNipc] = useState('');
  const [allowCreate, setAllowCreate] = useState('Não');
  const [password, setPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false); 
  const navigation = useNavigation();

  const handleImagePick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      setErrorMessage('Erro ao selecionar imagem');
    }
  };

  const handleRegister = async () => {
   
    if (!acceptedTerms) {
      Alert.alert('Erro', 'Você precisa aceitar os termos e condições para se registrar.', [{ text: 'OK' }]);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let photoURL = '';
      if (selectedImage) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const storageRef = ref(storage, `profilePictures/${user.uid}.jpg`);
        await uploadBytes(storageRef, blob);
        photoURL = await getDownloadURL(storageRef);
      }

      await setDoc(doc(firestore, "users", user.uid), {
        name: name,
        email: email,
        socialObject: socialObject,
        headquarters: headquarters,
        phone: phone,
        photoURL: photoURL,
        userType: "Empresa",
        allowCreate: allowCreate,
      });

      Alert.alert('Sucesso', 'Cadastro da empresa realizado com sucesso', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
    } catch (error) {
      setErrorMessage('Erro ao registrar a empresa: ' + error.message);
    }
  };

  return (
    <ImageBackground source={require('../assets/Registo_de_Empresa.png')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(20) }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Registo de Empresas</Text>
        </View>

        <View style={[styles.cardContainer, { backgroundColor: 'rgba(255, 255, 255, 0.7)' }]}>
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}

          <TouchableOpacity onPress={handleImagePick} style={styles.regButton}>
            <Text style={styles.buttonText}>Escolher Foto de Perfil</Text>
          </TouchableOpacity>

          <Text style={{marginBottom:hp(2.3),marginTop:hp(-1), textAlign:'right', marginRight:wp(5.5), color:'red'}}>* Campos Obrigatórios</Text>

          <Text style={styles.inpuTitle}>Nome</Text>
          <TextInput value={name} onChangeText={setName} style={styles.authText} />

          <Text style={styles.inpuTitle}>NIPC</Text>
          <TextInput value={nipc} onChangeText={setNipc} style={styles.authText} />

          <Text style={styles.inpuTitle}>Telemóvel</Text>
          <TextInput value={phone} onChangeText={setPhone} style={styles.authText} keyboardType="phone-pad" />

          <Text style={styles.inpuTitle}>Email</Text>
          <TextInput keyboardType='email-address' value={email} onChangeText={setEmail} style={styles.authText} />

          <Text style={styles.inpuTitle}>Senha</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
              style={{ flex: 1, paddingLeft: wp(3) }}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={{ padding: wp(2) }}>
              <Text style={{ fontSize: RFPercentage(2) }}>{isPasswordVisible ? 'Ocultar' : 'Mostrar'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inpuTitle}>Objeto Social</Text>
          <TextInput value={socialObject} onChangeText={setSocialObject} style={styles.authText} />

          <Text style={styles.inpuTitle}>Sede</Text>
          <TextInput value={headquarters} onChangeText={setHeadquarters} style={styles.authText} />

          
           <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={() => setAcceptedTerms(!acceptedTerms)} style={styles.checkbox}>
                {acceptedTerms && <View style={styles.checkboxTick} />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                Aceito os {''}
                <Text style={styles.linkText} onPress={() => Linking.openURL('https://intellion.pt/termos-e-condicoes-green-volunteers/')}>
                  termos e condições
                </Text>
              </Text>
            </View>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ textDecorationLine: 'underline', marginHorizontal: Platform.OS==='ios'?hp(15.):hp(14.5), color: 'blue', fontSize:Platform.OS==='ios'? RFPercentage(1.7):RFPercentage(2.3), marginBottom: hp(2) }}>Voltar ao Login</Text>
            </TouchableOpacity>

          {errorMessage ? <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text> : null}

          <TouchableOpacity onPress={handleRegister} style={styles.regButton}>
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: hp(5),
  },
  headerText: {
    fontSize: Platform.OS === 'ios' ? RFPercentage(3.5) : RFPercentage(4),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: hp(2),
  },
  cardContainer: {
    width: wp(90),
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    justifyContent: 'center',
    elevation: 5,
    marginHorizontal: wp(6),
    paddingVertical: hp(5),
  },
  inpuTitle: {
    fontSize: RFPercentage(1.5),
    marginHorizontal: wp(5),
    fontWeight: '600',
  },
  authText: {
    marginVertical: hp(2),
    marginHorizontal: wp(5),
    borderWidth: 1,
    borderRadius: 5,
    height: hp(5),
    paddingLeft: wp(3),
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
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'normal',
    marginTop: Platform.OS === 'ios' ? hp(0.5) : hp(-0.4),
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(5),
    marginVertical: hp(2),
    borderWidth: 1,
    borderRadius: 5,
    height: hp(5),
  },
  imagePreview: {
    width: wp(70),
    height: hp(30),
    marginHorizontal: wp(10),
    marginTop: wp(0),
    borderRadius: wp(70),
    resizeMode: 'stretch',
    marginBottom: hp(2),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(5.5),
    marginBottom: hp(2),
  },
  checkbox: {
    width: wp(5),
    height: wp(5),
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxTick: {
    width: wp(3),
    height: wp(3),
    backgroundColor: '#3D550C',
  },
  checkboxLabel: {
    marginLeft: wp(2),
    fontSize: RFPercentage(2),
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default RegisterCompanyScreen;
