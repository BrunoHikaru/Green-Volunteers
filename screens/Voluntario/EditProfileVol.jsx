import React, { useState } from 'react';
import { Text, Image, View, TextInput, StyleSheet, Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { auth, firestore } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
import * as DocumentPicker from 'expo-document-picker';

const EditProfileVol = ({ navigation, route }) => {
  const { userData } = route.params;

  const [photoURL, setImage] = useState(userData.photoURL || '');
  const [name, setName] = useState(userData.name || '');
  const [birthdate, setBirthdate] = useState(userData.birthdate || '');
  const [gender, setGender] = useState(userData.gender || '');
  const [email, setEmail] = useState(userData.email || '');
  const [phoneNumber, setPhoneNumber] = useState(userData.phoneNumber || '');
  const [deficiencias, setDeficiencias] = useState(userData.deficiencias || '');
  const [endereco, setEndereco] = useState(userData.endereco || '');
  const [profissao, setProfissao] = useState(userData.profissao || '');
  const [estado_civil, setEstadoCivil] = useState(userData.estado_civil || '');
  const [nif, setNif] = useState(userData.nif || '');
  const [habilidades, setHabilidades] = useState(userData.habilidades || '');
  const [biografia, setBiografia] = useState(userData.biografia || '');
  const [interesses, setInteresses] = useState(userData.interesses || '');
  const [resumeURL, setResumeURL] = useState(userData.resumeURL || '');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);



  const [loading, setLoading] = useState(false);

  const handleResumePick = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
      });

      if (!result.canceled) {
        
        const selectedResumeUri = result.assets[0].uri;
        const user = auth.currentUser;
        const storage = getStorage();
        const resumeRef = ref(storage, `resumes/${user.uid}.pdf`);

        const response = await fetch(selectedResumeUri);
        const blob = await response.blob();

        await uploadBytes(resumeRef, blob);
        const downloadURL = await getDownloadURL(resumeRef);

        
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, {
          resumeURL: downloadURL,
        });

        setResumeURL(downloadURL);
        Alert.alert('Currículo atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao selecionar ou atualizar currículo:', error);
      Alert.alert('Erro', 'Erro ao selecionar ou atualizar currículo.');
    }
  };


  const handleSave = async () => {
    if (!name || !birthdate || !gender || !email || !phoneNumber || !deficiencias || !endereco || !profissao || !habilidades || !biografia || !interesses) {
     
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.', [{ text: 'OK' }]);
      return;
    }

    console.log((!name || !birthdate || !gender || !email || !phoneNumber || !deficiencias || !endereco || !profissao || !habilidades || !biografia || !interesses))

    setLoading(true);
    try {
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);

        await updateDoc(userDocRef, {
          photoURL,
          name,
          birthdate,
          gender,
          email,
          phoneNumber,
          deficiencias,
          endereco,
          profissao,
          estado_civil,
          nif,
          habilidades,
          biografia,
          interesses,
          resumeURL,
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

  const pickerStyles = {
    inputIOS: {
      height: hp(5),
      borderWidth: 1,
      borderColor: 'gray', 
      borderRadius: 5,
      paddingLeft: wp(3),
      marginTop: hp(1),
      marginHorizontal: wp(6),
      fontSize: RFPercentage(2), 
      color: 'black', 
    },
    inputAndroid: {
      height: hp(7),
      borderWidth: 1,
      borderColor: 'gray', 
      borderRadius: 5,
      paddingLeft: hp(2),
      marginTop: hp(1),
      marginHorizontal: wp(10),
      fontSize: RFPercentage(2), 
      color: 'black', 
    },
    placeholder: {
      color: 'black', 
    },
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
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Digite seu nome" />


        <Text style={styles.label}>* Data de Nascimento:</Text>
        <TouchableOpacity onPress={showDatePicker}>
          <TextInput
            value={formatDate(birthdate)}
            placeholder="Selecione a data de nascimento"
            style={[styles.input, { color: 'black' }]}
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


        <Text style={styles.label}>* Gênero:</Text>
        <RNPickerSelect
          placeholder={{ label: 'Selecione o gênero', value: null }} 
          onValueChange={(value) => setGender(value)}
          items={[
            { label: 'Masculino', value: 'Masculino' },
            { label: 'Feminino', value: 'Feminino' },
            { label: 'Outro', value: 'Outro' }
          ]}
          value={gender} 
          style={pickerStyles}
          useNativeAndroidPickerStyle={false}
        />



        <Text style={styles.label}>* Email:</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Digite seu email" editable={false} selectTextOnFocus={false} />


        <Text style={styles.label}>* Telemóvel:</Text>
        <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Digite seu telefone" keyboardType='phone-pad' />


        <Text style={styles.label}>* Restrições ou deficiências:</Text>
        <TextInput style={styles.input} value={deficiencias} onChangeText={setDeficiencias} placeholder="Digite suas restrições" />


        <Text style={styles.label}>* Endereço:</Text>
        <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Digite seu endereço" />


        <Text style={styles.label}>* Profissão:</Text>
        <TextInput style={styles.input} value={profissao} onChangeText={setProfissao} placeholder="Digite sua profissão" />


        <Text style={styles.label}>Estado civil:</Text>
        <RNPickerSelect
          placeholder={{ label: 'Selecione o estado civil', value: null }}
          onValueChange={(value) => setEstadoCivil(value)}
          items={[
            { label: 'Nenhum', value: 'Nenhum' },
            { label: 'Solteiro', value: 'Solteiro' },
            { label: 'Casado', value: 'Casado' },
            { label: 'Divorciado', value: 'Divorciado' },
            { label: 'Viúvo', value: 'Viúvo' }
          ]}
          value={estado_civil}
          style={pickerStyles}
          useNativeAndroidPickerStyle={false}
        />


        <Text style={styles.label}>NIF:</Text>
        <TextInput style={styles.input} value={nif} onChangeText={setNif} placeholder="Digite seu NIF" keyboardType='phone-pad'/>


        <Text style={styles.label}>* Habilidades especiais:</Text>
        <TextInput style={styles.input} value={habilidades} onChangeText={setHabilidades} placeholder="Digite suas habilidades" />


        <Text style={styles.label}>* Biografia:</Text>
        <TextInput style={styles.input} value={biografia} onChangeText={setBiografia} placeholder="Digite sua biografia" />


        <Text style={styles.label}>* Interesses e disponibilidade:</Text>
        <TextInput style={styles.input} value={interesses} onChangeText={setInteresses} placeholder="Digite seus interesses" />


        <Text style={styles.label}>Currículo:</Text>
        {resumeURL ? (
          <Text style={styles.input}>{resumeURL}</Text>
        ) : (
          <Text style={{ ...styles.input, color: 'gray' }}>Nenhum currículo selecionado</Text>
        )}

        <TouchableOpacity onPress={handleResumePick} style={styles.regButton}>
          <Text style={styles.buttonText}>Escolher Currículo (PDF)</Text>
        </TouchableOpacity>

        

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
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray', 
    height: hp(7),
    justifyContent: 'center',
    marginHorizontal: hp(5),
    marginVertical: hp(1),
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

export default EditProfileVol;
