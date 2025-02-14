import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDatabase, ref, push } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';

const criarNoticias = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
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

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storage = getStorage();
    const imageRef = storageRef(storage, `news/${Date.now()}.jpg`);
    await uploadBytes(imageRef, blob);

    const downloadUrl = await getDownloadURL(imageRef);
    return downloadUrl;
  };

  const saveNews = async () => {
    if (!title || !text) {
      Alert.alert('Erro', 'O título e o texto são obrigatórios!');
      return;
    }

    let imageUrl = '';
    if (imageUri) {
      imageUrl = await uploadImage(imageUri);
    }

    const db = getDatabase();
    const newsRef = ref(db, 'news');
    const newNews = {
      title,
      subtitle,
      text,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    try {
      await push(newsRef, newNews);
      Alert.alert('Sucesso', 'Notícia criada com sucesso!');

      
      setTitle('');
      setSubtitle('');
      setText('');
      setImageUri(null);

      navigation.goBack();  
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar notícia: ' + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Criar Notícia</Text>
      <Text style={styles.label}>Imagem</Text>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <TouchableOpacity onPress={pickImage} style={{...styles.imageButton,marginTop:hp(1)}}>
          <Text style={{color:'white',textAlign:'center', fontSize:Platform.OS==='ios'?RFPercentage(2):RFPercentage(2)+Platform.OS==='ios'?RFPercentage(3):RFPercentage(3)}}>Escolher Imagem</Text>
        </TouchableOpacity>
      )}
      
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Digite o título"
      />

      <Text style={styles.label}>Subtítulo</Text>
      <TextInput
        style={styles.input}
        value={subtitle}
        onChangeText={setSubtitle}
        placeholder="Digite o subtítulo"
      />

      <Text style={styles.label}>Texto</Text>
      <TextInput
        style={[styles.input, { height: 150 }]}
        value={text}
        onChangeText={setText}
        placeholder="Digite o texto da notícia"
        multiline
      />

      <TouchableOpacity onPress={saveNews} style={styles.salvarButton}>
        <Text style={{color:'white',textAlign:'center', fontSize:Platform.OS==='ios'?RFPercentage(2):RFPercentage(2)+Platform.OS==='ios'?RFPercentage(3):RFPercentage(3)}}>Salvar Notícia</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom:hp(25)
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    marginTop:hp(3)
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  salvarButton:{
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
    marginTop:hp(5)

  },
  imageButton:{
    backgroundColor: '#b8aeb2',
    borderRadius: 5,
    padding: 10,
    marginTop:hp(5)

  },
  headerText:{
    fontSize:Platform.OS==='ios'?RFPercentage(3):RFPercentage(3)+Platform.OS==='ios'?RFPercentage(4):RFPercentage(4),
    fontWeight:'bold',
    textAlign:'center',
    marginBottom:hp(3),
    marginTop:hp(8)
  }
});

export default criarNoticias;
