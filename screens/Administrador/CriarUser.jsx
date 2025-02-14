import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app,auth, firestore } from '../../firebase'; 
import RNPickerSelect from 'react-native-picker-select';


const CreateUserScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [userType, setUserType] = useState('');
  const [headquarters, setHeadquarters] = useState('');
  const [phone, setPhone] = useState('');
  const [socialObject, setSocialObject] = useState('');

  const handleCreateUser = async () => {
    if (!name || !email || !password || !userType) {
      Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios: Nome, Email, Senha e Tipo de Utilizador.');
      return;
    }

    try {
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user= userCredential.user;

      const db = getFirestore(app);
      await setDoc(doc(firestore, 'users', user.uid), {
  
        name,
        email,
        userType,
        headquarters,
        phone,
        socialObject,
      });

      Alert.alert('Sucesso', 'Usuário criado com sucesso!');
      navigation.goBack(); 
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      Alert.alert('Erro', `Não foi possível criar o usuário: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Criar Novo Utilizador</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nome (Obrigatório)"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email (Obrigatório)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha (Obrigatório)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true} 
      />

      <RNPickerSelect
        onValueChange={(value) => setUserType(value)}
        items={[
          { label: 'Administrador', value: 'Administrador' },
          { label: 'Voluntário', value: 'Voluntário' },
          { label: 'Empresa', value: 'Empresa' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: 'Selecione o Tipo de Utilizador (Obrigatório)', value: null }}
      />

      <TextInput
        style={styles.input}
        placeholder="Sede"
        value={headquarters}
        onChangeText={setHeadquarters}
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Objeto Social"
        value={socialObject}
        onChangeText={setSocialObject}
      />

      <Button title="Criar Utilizador" onPress={handleCreateUser} />
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  inputAndroid: {
    height: 50,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 20,
    backgroundColor: 'white',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: 'white',
  },
});

export default CreateUserScreen;
