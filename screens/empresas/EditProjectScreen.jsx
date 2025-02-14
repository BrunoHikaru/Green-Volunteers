import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { auth } from '../../firebase';
import { getDatabase, ref, set } from 'firebase/database';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../firebase';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

const EditProjectScreen = ({ route, navigation }) => {
  const { project, idprojecto } = route.params;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [user, setUser] = useState(null); 
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isLimitDatePickerVisible, setLimitDatePickerVisibility] = useState(false);

  const [actionField, setActionField] = useState(project?.actionField || '');
  const [city, setCity] = useState(project?.city || '');
  const [candidaturas, setCandidaturas] = useState(project?.candidaturas || []); 
  const [company, setCompany] = useState(project?.company || '');
  const [demonstrativeFilm, setDemonstrativeFilm] = useState(project?.demonstrativeFilm || '');
  const [description, setDescription] = useState(project?.description || '');
  const [developmentGoals, setDevelopmentGoals] = useState(project?.developmentGoals || '');
  const [endDate, setEndDate] = useState(project?.endDate || '');
  const [executionMode, setExecutionMode] = useState(project?.executionMode || '');
  const [imageUrl, setImage] = useState(project?.imageUrl || '');
  const [isValidated, setIsValidated] = useState(project?.isValidated || true);  
  const [legislations, setLegislations] = useState(project?.legislations || '');
  const [limitDate, setLimitDate] = useState(project?.limitDate || '');
  const [name, setName] = useState(project?.name || '');
  const [numberVacancies, setNumberVacancies] = useState(project?.numberVacancies || '');
  const [reducedMobility, setReducedMobility] = useState(project?.reducedMobility || false);  
  const [role, setRole] = useState(project?.role || '');
  const [specialSkills, setSpecialSkills] = useState(project?.specialSkills || '');
  const [startDate, setStartDate] = useState(project?.startDate || '');
  const [volunteerCharacteristic, setVolunteerCharacteristic] = useState(project?.volunteerCharacteristic || '');


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

        
        const imageRef = storageRef(storage, `projects/${idprojecto}.jpg`); 

        
        const response = await fetch(selectedImageUri);
        const blob = await response.blob();

        
        await uploadBytes(imageRef, blob);

        
        const downloadURL = await getDownloadURL(imageRef);

        
        const firestore = getFirestore();
        const projectDocRef = doc(firestore, 'projects', idprojecto);
        await setDoc(projectDocRef, {
          imageUrl: downloadURL, 
        }, { merge: true }); 

        
        setImage(downloadURL);
      }
    } catch (error) {
      console.error('Erro ao selecionar ou atualizar imagem:', error);
    }
  };



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.', [{ text: 'OK' }]);
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;

      if (user) {
        const database = getDatabase();
        const projectRef = ref(database, `projects/${idprojecto}`);

       
        await set(projectRef, {
          imageUrl,
          name,
          company,
          description,
          city,
          actionField,
          demonstrativeFilm,
          developmentGoals,
          startDate,
          isValidated,
          endDate,
          limitDate,
          executionMode,
          legislations,
          numberVacancies,
          reducedMobility,
          role,
          specialSkills,
          volunteerCharacteristic,
          candidaturas: candidaturas.length > 0 ? candidaturas : currentData.candidaturas, 
          creatorId: user.uid,
        });

        Alert.alert('Sucesso', 'Informações atualizadas com sucesso!');

      }
    } catch (error) {
      console.error('Erro ao atualizar as informações do projeto:', error);
      Alert.alert('Erro', 'Erro ao atualizar as informações. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };





  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date.toISOString());
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(date.toISOString());
    hideEndDatePicker();
  };

  const showLimitDatePicker = () => {
    setLimitDatePickerVisibility(true);
  };

  const hideLimitDatePicker = () => {
    setLimitDatePickerVisibility(false);
  };

  const handleLimitDateConfirm = (date) => {
    setLimitDate(date.toISOString());
    hideLimitDatePicker();
  };

  const renderCandidaturas = () => {
    if (candidaturas.length > 0) {
      return (
        <View style={styles.candidaturasContainer}>
          <Text style={styles.label}>Candidaturas:</Text>
         
          {candidaturas && candidaturas.map((candidatura) => (
            <Text key={candidatura.uid}>Candidatura Status: {candidatura.status}</Text>
          ))}
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={
            imageUrl 
              ? { uri: imageUrl } 
              : require('../../assets/project.png') 
          }
          style={styles.profileImage}
          onError={() => setImage('')} 
        />

        <TouchableOpacity onPress={handleImagePick} style={styles.regButton}>
          <Text style={styles.buttonText}>Escolher Foto de Projeto</Text>
        </TouchableOpacity>

        <Text style={{ marginBottom: hp(2.3), marginTop: hp(-1), textAlign: 'right', marginRight: wp(10), color: 'red' }}>* Campos Obrigatórios</Text>

        <Text style={styles.label}>* Nome:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Digite o nome do projeto"
        />

        <Text style={styles.label}>* Empresa:</Text>
        <TextInput
          style={styles.input}
          value={company}
          onChangeText={setCompany}
          placeholder="Digite o nome da empresa"
        />

        <Text style={styles.label}>* Descrição:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Digite a descrição"
        />

        <Text style={styles.label}>* Localidade:</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Digite a localidade"
        />

        <Text style={styles.label}>* Campo de Atuação:</Text>
        <TextInput
          style={styles.input}
          value={actionField}
          onChangeText={setActionField}
          placeholder="Digite o campo de atuação"
        />

        <Text style={styles.label}>* Vídeo:</Text>
        <TextInput
          style={styles.input}
          value={demonstrativeFilm}
          onChangeText={setDemonstrativeFilm}
          placeholder="Digite o link do vídeo demonstrativo"
        />

        <Text style={styles.label}>* Objetivo de Desenvolvimento:</Text>
        <TextInput
          style={styles.input}
          value={developmentGoals}
          onChangeText={setDevelopmentGoals}
          placeholder="Digite os objetivos de desenvolvimento"
        />

        <Text style={styles.label}>* Data Início:</Text>
        <TouchableOpacity onPress={showStartDatePicker}>
          <TextInput
            value={formatDate(startDate)}
            placeholder="Selecione a data de início"
            style={[styles.input, { color: 'black' }]}
            editable={false}
          />
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isStartDatePickerVisible}
          mode="date"
          onConfirm={handleStartDateConfirm}
          onCancel={hideStartDatePicker}
          locale="pt-BR"
        />


        <Text style={styles.label}>* Data Fim:</Text>
        <TouchableOpacity onPress={showEndDatePicker}>
          <TextInput
            value={formatDate(endDate)}
            placeholder="Selecione a data de fim"
            style={[styles.input, { color: 'black' }]}
            editable={false}
          />
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isEndDatePickerVisible}
          mode="date"
          onConfirm={handleEndDateConfirm}
          onCancel={hideEndDatePicker}
          locale="pt-BR"
        />

        <Text style={styles.label}>* Data Limite para Inscrição:</Text>
        <TouchableOpacity onPress={showLimitDatePicker}>
          <TextInput
            value={formatDate(limitDate)}
            placeholder="Selecione a data limite para inscrição"
            style={[styles.input, { color: 'black' }]}
            editable={false}
          />
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isLimitDatePickerVisible}
          mode="date"
          onConfirm={handleLimitDateConfirm}
          onCancel={hideLimitDatePicker}
          locale="pt-BR"
        />

        <Text style={styles.label}>* Modo de Execução:</Text>
        <TextInput
          style={styles.input}
          value={executionMode}
          onChangeText={setExecutionMode}
          placeholder="Digite o modo de execução"
        />

        <Text style={styles.label}>* Legislações:</Text>
        <TextInput
          style={styles.input}
          value={legislations}
          onChangeText={setLegislations}
          placeholder="Digite as legislações"
        />

        <Text style={styles.label}>* Vagas:</Text>
        <TextInput
          style={styles.input}
          value={numberVacancies}
          onChangeText={setNumberVacancies}
          placeholder="Digite o número de vagas"
        />

        <Text style={styles.label}>* Mobilidade Reduzida:</Text>
        <TextInput
          style={styles.input}
          value={reducedMobility}
          onChangeText={setReducedMobility}
          placeholder="Digite se há mobilidade reduzida (true/false)"
        />

        <Text style={styles.label}>* Cargo/Função:</Text>
        <TextInput
          style={styles.input}
          value={role}
          onChangeText={setRole}
          placeholder="Digite o cargo ou função"
        />

        <Text style={styles.label}>* Habilidades Especiais:</Text>
        <TextInput
          style={styles.input}
          value={specialSkills}
          onChangeText={setSpecialSkills}
          placeholder="Digite as habilidades especiais"
        />

        <Text style={styles.label}>* Características do Voluntário:</Text>
        <TextInput
          style={styles.input}
          value={volunteerCharacteristic}
          onChangeText={setVolunteerCharacteristic}
          placeholder="Digite as características do voluntário"
        />

        



        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveText}>{loading ? 'Salvando...' : 'Salvar'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  )
}

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

export default EditProjectScreen