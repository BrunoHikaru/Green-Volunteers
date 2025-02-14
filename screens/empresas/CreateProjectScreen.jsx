import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, TouchableOpacity, Image } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import RNPickerSelect from 'react-native-picker-select';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set } from "firebase/database";
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../../firebase';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const CreateProjectScreen = ({ navigation }) => {
  const { control, handleSubmit, reset } = useForm();
  const [imageUri, setImageUri] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedLimitDate, setSelectedLimitDate] = useState(null);


  const onSubmit = async (data) => {
    const storage = getStorage();
    const db = getDatabase();
    const user = auth.currentUser;

    if (!user) {
      alert('Usuário não autenticado.');
      return;
    }

  
    let imageUrl = '';
    if (imageUri) {
      try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const imageRef = ref(storage, `projects/${data.name}.jpg`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      } catch (error) {
        console.error('Erro ao fazer upload da imagem: ', error);
      }
    }

  
    const projectRef = dbRef(db, 'projects/' + Date.now());
    set(projectRef, {
      ...data,
      imageUrl: imageUrl || null,
      dateCreated: new Date().toISOString(),
      isValidated: false,
      creatorId: user.uid,
    });

    
    reset(); 
    setImageUri(null); 

    navigation.navigate('Home');
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Desculpe, precisamos de permissão para acessar a galeria!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const cities = {
    "Norte": ["Porto", "Braga", "Guimarães", "Viana do Castelo", "Bragança"],
    "Centro": ["Coimbra", "Aveiro", "Leiria", "Viseu"],
    "Lisboa e Vale do Tejo": ["Lisboa", "Sintra", "Cascais", "Oeiras"],
    "Alentejo": ["Évora", "Beja", "Portalegre", "Elvas"],
    "Algarve": ["Faro", "Albufeira", "Portimão", "Lagos"],
    "Açores": ["Ponta Delgada", "Angra do Heroísmo", "Horta"],
    "Madeira": ["Funchal"]
  };

  const cityItems = Object.entries(cities).flatMap(([region, cityList]) =>
    cityList.map(city => ({ label: `${city} (${region})`, value: city }))
  );

  const showDatePicker = (field) => {
    setDatePickerVisibility(field);
  };


  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date, field) => {
    switch (field) {
      case 'startDate':
        setSelectedStartDate(date);
        break;
      case 'endDate':
        setSelectedEndDate(date);
        break;
      case 'limitDate':
        setSelectedLimitDate(date);
        break;
    }
    hideDatePicker();
  };


  const formatDate = (date) => {
    return date ? date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : 'Selecione uma data';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: hp(20) }}>
      <Text style={styles.title}>Criar Novo Projeto</Text>

      <Text style={styles.controlerName}>Nome do Projeto</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}

            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
          />
        )}
      />

      <Text style={styles.controlerName}>Nome da empresa</Text>
      <Controller
        control={control}
        name="company"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}

            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
          />
        )}
      />

      <Text style={styles.controlerName}>Área de atuação</Text>
      <Controller
        control={control}
        name="actionField"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}

            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
          />
        )}
      />

      <Text style={styles.controlerName}>Características do voluntário</Text>
      <Controller
        control={control}
        name="volunteerCharacteristic"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}

            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline={true}
            numberOfLines={4}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
          />
        )}
      />

      <Text style={styles.controlerName}>Habilidades especiais</Text>
      <Controller
        control={control}
        name="specialSkills"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            multiline={true}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
          />
        )}
      />

      <Text style={styles.controlerName}>Descrição do projeto</Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, { height: 100 }]}

            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline={true}
            numberOfLines={4}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
          />
        )}
      />

      <Text style={styles.controlerName}>Cargo/Função</Text>
      <Controller
        control={control}
        name="role"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            multiline={true}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
          />
        )}
      />

      <Text style={styles.controlerName}>Modo de Execução</Text>
      <Controller
        control={control}
        name="executionMode"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Ex: Presencial, Remoto, Híbrido"
            onChangeText={onChange}
            value={value}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
          />
        )}
      />

      <Text style={styles.controlerName}>Data de início</Text>
      <Controller
        control={control}
        name="startDate"
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity onPress={() => showDatePicker('startDate')} style={styles.dateInput}>
              <Text style={styles.input}>{formatDate(selectedStartDate)}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible === 'startDate'}
              mode="date"
              onConfirm={(date) => {
                onChange(date.toISOString());
                handleConfirm(date, 'startDate');
              }}
              onCancel={hideDatePicker}
              locale='pt-BR'
            />
          </>
        )}
      />

      <Text style={styles.controlerName}>Data de Fim</Text>
      <Controller
        control={control}
        name="endDate"
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity onPress={() => showDatePicker('endDate')} style={styles.dateInput}>
              <Text style={styles.input}>{formatDate(selectedEndDate)}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible === 'endDate'}
              mode="date"
              onConfirm={(date) => {
                onChange(date.toISOString());
                handleConfirm(date, 'endDate');
              }}
              onCancel={hideDatePicker}
              locale='pt-BR'
            />
          </>
        )}
      />

      <Text style={styles.controlerName}>Data limite para inscrição</Text>
      <Controller
        control={control}
        name="limitDate"
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity onPress={() => showDatePicker('limitDate')} style={styles.dateInput}>
              <Text style={styles.input}>{formatDate(selectedLimitDate)}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible === 'limitDate'}
              mode="date"
              onConfirm={(date) => {
                onChange(date.toISOString());
                handleConfirm(date, 'limitDate');
              }}
              onCancel={hideDatePicker}
              locale='pt-BR'
            />
          </>
        )}
      />

      <Text style={styles.controlerName}>Quantidade de vagas</Text>
      <Controller
        control={control}
        name="numberVacancies"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            keyboardType='number-pad'
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
            />
          )}
          />

      <Text style={styles.controlerName}>Objetivos de desenvolvimento sustentável</Text>
      <Controller
        control={control}
        name="developmentGoals"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            multiline={true}
          
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
          />
        )}
      />

      <Text style={styles.controlerName}>Legislações</Text>
      <Controller
        control={control}
        name="legislations"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            multiline={true}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
          />
        )}
      />


      <Controller
        control={control}
        name="reducedMobility"
        render={({ field: { onChange, value } }) => (
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Tem mobilidade reduzida?</Text>
            <RNPickerSelect
              onValueChange={onChange}
              value={value}
              items={[
                { label: 'Não', value: 'não' },
                { label: 'Sim', value: 'sim' },
              ]}
              style={pickerSelectStyles}
            />
          </View>
        )}
      />

      
      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, value } }) => (
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Cidade</Text>
            <RNPickerSelect
              onValueChange={onChange}
              value={value}
              items={cityItems}
              style={pickerSelectStyles}
              placeholder={{ label: "Selecione uma cidade", value: null }}
            />
          </View>
        )}
      />


      <Text style={styles.controlerName}>Vídeo demonstrativo (URL)</Text>
      <Controller
        control={control}
        name="demonstrativeFilm"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}

            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
          />
        )}
      />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Selecionar Imagem</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      <Button title="Criar Projeto" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    paddingBottom: hp(50)
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(7),
    marginTop: 50,
    textAlign: 'center'
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginLeft: 10,
  },
  imageButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: hp(12),
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 20,
  },
  controlerName: {
    marginHorizontal: hp(0.52),
    marginBottom: hp(0.5)
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
});

export default CreateProjectScreen;
