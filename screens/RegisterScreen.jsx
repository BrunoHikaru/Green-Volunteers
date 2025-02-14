import React, { useState, useEffect } from 'react';
import { View, Linking, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, ImageBackground, KeyboardAvoidingView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, firestore, storage } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { RFPercentage } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as DocumentPicker from 'expo-document-picker';





export default function RegisterScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [deficiencias, setDeficiencias] = useState('');
  const [endereco, setEndereco] = useState('');
  const [profissao, setProfissao] = useState('');
  const [estado_civil, setEstadocivil] = useState('');
  const [nif, setNif] = useState('');
  const [habilidades, setHabilidades] = useState('');
  const [interesses, setInteresses] = useState('');
  const [biografia, setBiografia] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [resume, setResume] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false); 

 

  const handleResumePick = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
      });

      if (!result.canceled) {
        setResume(result.assets[0].uri);
      }
    } catch (error) {
      setErrorMessage('Erro ao selecionar o currículo');
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
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      setErrorMessage('Erro ao selecionar imagem');
    }
  };

  const handleRegister = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let photoURL = '';
      let resumeURL = '';

      if (selectedImage) {
        const response = await fetch(selectedImage);
        if (!response.ok) throw new Error('Erro ao fazer fetch da imagem: ' + response.status);

        const blob = await response.blob();
        const storageRef = ref(storage, `profilePictures/${user.uid}.jpg`);
        await uploadBytes(storageRef, blob);

        photoURL = await getDownloadURL(storageRef);
      }

      if (resume) {
        const response = await fetch(resume);
        if (!response.ok) throw new Error('Erro ao fazer fetch do currículo: ' + response.status);

        const blob = await response.blob();
        const resumeRef = ref(storage, `resumes/${user.uid}.pdf`);
        await uploadBytes(resumeRef, blob);

        resumeURL = await getDownloadURL(resumeRef);
      }

     


      await setDoc(doc(firestore, "users", user.uid), {
        email: user.email,
        userType: 'Voluntário',
        photoURL: photoURL,
        resumeURL: resumeURL,
        name: name,
        birthdate: birthdate || 'Nenhum',
        gender: gender || 'Nenhum',
        phoneNumber: phoneNumber,
        endereco: endereco,
        profissao: profissao || 'Nenhuma',
        estado_civil: estado_civil || 'Nenhum',
        nif: nif || 'Nenhum',
        habilidades: habilidades,
        interesses: interesses,
        biografia: biografia,
        deficiencias: deficiencias,
        

      });


      
      Alert.alert(
        'Registro bem-sucedido',
        'Seu registro foi realizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              navigation.navigate('Login');
            },
          },
        ],
        { cancelable: false }
      );
      resetForm();

    } catch (error) {


      Alert.alert('Erro', 'Erro ao tentar registar \n O email inserido já está registado', [{ text: 'OK' }]);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setName('');
    setBirthdate('');
    setGender('');
    setEmail('');
    setErrorMessage('');
    setResume(null);
    setPassword('');
    setPhoneNumber('');
    setSelectedGroup('');
    setDeficiencias('');
    setEndereco('');
    setProfissao('');
    setEstadocivil('');
    setNif('');
    setHabilidades('');
    setInteresses('');
    setBiografia('');
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setBirthdate(date.toISOString());
    hideDatePicker();
  };

  const handleSubmit = async () => {

    
    if (!acceptedTerms) {
      Alert.alert('Erro', 'Você precisa aceitar os termos e condições para se registrar.', [{ text: 'OK' }]);
      return;
    }

    
    if (!name || !email || !password || !habilidades || !interesses || !biografia) {
      
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.', [{ text: 'OK' }]);
      return;
    }

    try {
      
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.length > 0) {
        
        Alert.alert('Erro', 'Este email já está registado. Por favor, utilize um email diferente.', [{ text: 'OK' }]);
      } else {
        
        handleRegister(email, password);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao verificar o email: '  [{ text: 'OK' }]);
    }
  };


  const formatDate = (date) => {
    if (!date) {
      return 'Selecione uma data';
    }
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ImageBackground source={require('../assets/Registo_de_Empresa.png')} style={style.backgroundImage}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

          
          <View style={[style.cardContainerRegisto, { backgroundColor: 'rgba(255, 255, 255, 0.7)' }]}>
            <Text style={style.headText2}>É uma empresa?</Text>
            <TouchableOpacity style={style.buttonRegistar} onPress={() => navigation.navigate('RegisterCompany')}>
              <Text style={{ ...style.buttonText, color: 'black', marginTop:hp(0.4) }}>Registar</Text>
            </TouchableOpacity>
          </View>

          <View style={style.headerContainer}>
            <Text style={style.headerText}>Registo</Text>
          </View>



          <View style={[style.cardContainer, { backgroundColor: 'rgba(255, 255, 255, 0.7)' }]}>
            {selectedImage && <Image source={{ uri: selectedImage }} style={style.imageStyle} />}

            <TouchableOpacity onPress={handleImagePick} style={style.regButton}>
              <Text style={style.buttonText}>Escolher Foto de Perfil</Text>
            </TouchableOpacity>

            <Text style={{ marginBottom: hp(2.3), marginTop: hp(-1), textAlign: 'right', marginRight: wp(5.5), color: 'red' }}>* Campos Obrigatórios</Text>

            <Text style={style.inpuTitle}>* Nome</Text>
            <TextInput value={name} onChangeText={text => setName(text)} style={style.authText} />

            <Text style={style.inpuTitle}>Data de Nascimento</Text>
            <TouchableOpacity onPress={showDatePicker}>
              <TextInput
                value={formatDate(birthdate)}
                placeholder="Selecione a data de nascimento"
                style={style.authText}
                editable={false}
              />
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              locale='pt-BR'
            />
            <Text style={style.inpuTitle}>Gênero</Text>
            <RNPickerSelect
              placeholder={{ label: 'Selecione o gênero', value: null }}
              onValueChange={(value) => setGender(value)}
              items={[
                { label: 'Masculino', value: 'Masculino' },
                { label: 'Feminino', value: 'Feminino' },
                { label: 'Outro', value: 'Outro' }
              ]}
              style={pickerStyles}
              useNativeAndroidPickerStyle={false}
            />

            <Text style={style.inpuTitle}>* Email</Text>
            <TextInput value={email} onChangeText={text => setEmail(text)} style={style.authText} keyboardType='email-address' />

            <Text style={style.inpuTitle}>* Senha</Text>
            <View style={style.passwordContainer}>
              <TextInput
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={text => setPassword(text)}
                style={{ flex: 1, paddingLeft: wp(3) }}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={{ padding: wp(2) }}>
                <Text style={{ fontSize: RFPercentage(2) }}>{isPasswordVisible ? 'Ocultar' : 'Mostrar'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={style.inpuTitle}>Telemóvel</Text>
            <TextInput value={phoneNumber} onChangeText={text => setPhoneNumber(text)} style={style.authText} keyboardType='phone-pad' />

            <Text style={style.inpuTitle}>Endereço</Text>
            <TextInput value={endereco} onChangeText={text => setEndereco(text)} style={style.authText} />

            <Text style={style.inpuTitle}>Profissão</Text>
            <TextInput value={profissao} onChangeText={text => setProfissao(text)} style={style.authText} />

            <Text style={style.inpuTitle}>Estado Civil</Text>
            <RNPickerSelect
              placeholder={{ label: 'Selecione o estado civil', value: null }}
              onValueChange={(value) => setEstadocivil(value)}
              items={[
                { label: 'Nenhum', value: 'Nenhum' },
                { label: 'Solteiro', value: 'Solteiro' },
                { label: 'Casado', value: 'Casado' },
                { label: 'Divorciado', value: 'Divorciado' },
                { label: 'Viúvo', value: 'Viúvo' }
              ]}
              style={pickerStyles}
              useNativeAndroidPickerStyle={false}

            />

            <Text style={style.inpuTitle}>NIF</Text>
            <TextInput value={nif} onChangeText={text => setNif(text)} style={style.authText} keyboardType='numeric' />

            <Text style={style.inpuTitle}>* Habilidades</Text>
            <TextInput value={habilidades} onChangeText={text => setHabilidades(text)} style={style.authText} />

            <Text style={style.inpuTitle}>* Interesses</Text>
            <TextInput value={interesses} onChangeText={text => setInteresses(text)} style={style.authText} />

            <Text style={style.inpuTitle}>* Deficiências</Text>
            <TextInput value={deficiencias} onChangeText={text => setDeficiencias(text)} style={style.authText} />

            <Text style={style.inpuTitle}>* Biografia</Text>
            <TextInput
              value={biografia}
              onChangeText={text => setBiografia(text)}
              style={[style.authText, { height: hp(10) }]}
              multiline={true}
            />

            
            <View style={style.checkboxContainer}>
              <TouchableOpacity onPress={() => setAcceptedTerms(!acceptedTerms)} style={style.checkbox}>
                {acceptedTerms && <View style={style.checkboxTick} />}
              </TouchableOpacity>
              <Text style={style.checkboxLabel}>
                Aceito os {''}
                <Text style={style.linkText} onPress={() => Linking.openURL('https://intellion.pt/termos-e-condicoes-green-volunteers/')}>
                  termos e condições
                </Text>
              </Text>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ textDecorationLine: 'underline', marginHorizontal: Platform.OS === 'ios' ? hp(15) : hp(14.5), color: 'blue', fontSize: Platform.OS === 'ios' ? RFPercentage(1.7) : RFPercentage(2.3), marginBottom: hp(2) }}>Voltar ao Login</Text>
            </TouchableOpacity>


            {resume && (
              <View style={style.filePreview}>
                <Text style={{ marginHorizontal: hp(13), fontSize: Platform.OS === 'ios' ? RFPercentage(1.7) : RFPercentage(2.7), marginBottom: hp(1) }}>Currículo Escolhido</Text>
              </View>
            )}

            <TouchableOpacity onPress={handleResumePick} style={style.regButton}>
              <Text style={style.buttonText}>Escolher Currículo (PDF)</Text>
            </TouchableOpacity>



            <TouchableOpacity onPress={handleSubmit} style={style.regButton}>
              <Text style={style.buttonText}>Registrar</Text>
            </TouchableOpacity>

            {errorMessage ? <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text> : null}
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const style = StyleSheet.create({
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
    marginTop: hp(-2)
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
  cardContainerRegisto: {
    width: wp(90),
    height: hp(10),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    marginTop: hp(7),
    marginBottom: hp(2),
    justifyContent: 'center',
    elevation: 5,
    marginHorizontal: wp(5),
  },
  headText2: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: RFPercentage(2),
    marginTop: hp(1),
    marginBottom: hp(3),
  },
  buttonRegistar: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    width: wp(35),
    height: Platform.OS === 'ios' ? hp(3) : hp(4),
    marginHorizontal: wp(27),
    backgroundColor: '#B6B6AD',
    marginTop: Platform.OS === 'ios' ? hp(-1.2) : hp(-2),
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
    marginTop: Platform.OS === 'ios' ? hp(0.5) : hp(0.4),
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
  imageStyle: {
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
    marginBottom: hp(4),
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

const pickerStyles = {
  inputIOS: {
    height: hp(5),
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: wp(3),
    marginVertical: hp(2),
    marginHorizontal: wp(5),
  },
  inputAndroid: {
    height: hp(5),
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: wp(3),
    marginVertical: hp(2),
    marginHorizontal: wp(5),
  },
};


