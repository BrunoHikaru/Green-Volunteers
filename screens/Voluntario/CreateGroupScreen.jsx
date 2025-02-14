import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { firestore, auth, storage } from '../../firebase'; 
import * as ImagePicker from 'expo-image-picker'; 
import Icon from 'react-native-vector-icons/Ionicons';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CreateGroupScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState(null); 
  const [selectedUsers, setSelectedUsers] = useState([]); 
  const [allUsers, setAllUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const currentUserId = auth.currentUser.uid;

  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCollection = await getDocs(collection(firestore, 'users'));
      const usersList = usersCollection.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(user => user.id !== currentUserId); 
      setAllUsers(usersList);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); 
  }, []);

 
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para enviar uma imagem.');
    }
  };

 
  const selectImage = async () => {
    await requestPermission();
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setGroupImage(result.assets[0]); 
    }
  };


  const createGroup = async () => {
    if (groupName.trim() === '') return;
    
    let imageUrl = '';
    if (groupImage) {
      const imageRef = ref(storage, `groupImages/${Date.now()}_${groupImage.uri.split('/').pop()}`);
      const img = await fetch(groupImage.uri);
      const bytes = await img.blob();
      await uploadBytes(imageRef, bytes);
      imageUrl = await getDownloadURL(imageRef); 
    }

    const newGroup = {
      groupName,
      groupImage: imageUrl, 
      members: [currentUserId, ...selectedUsers], 
      createdAt: new Date(),
    };

    await addDoc(collection(firestore, 'groups'), newGroup);
    navigation.goBack(); 
  };

  
  const renderUserItem = ({ item }) => {
    const isSelected = selectedUsers.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.userItem, isSelected && styles.userItemSelected]} 
        onPress={() => {
          if (isSelected) {
            setSelectedUsers(prev => prev.filter(userId => userId !== item.id)); 
          } else {
            setSelectedUsers(prev => [...prev, item.id]); 
          }
        }}
      >
        <Text style={styles.userName}>{item.name} ({item.userType})</Text>
        {isSelected && <Icon name="checkmark-circle" size={24} color="green" />} 
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar novo grupo</Text>

     
      <TextInput
        style={styles.input}
        value={groupName}
        onChangeText={setGroupName}
        placeholder="Nome do grupo"
      />

      
      <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
        <Icon name="image-outline" size={24} color="#007bff" />
        <Text style={styles.imagePickerText}>Selecionar imagem do grupo</Text>
      </TouchableOpacity>

      
      {groupImage && (
        <Image
          source={{ uri: groupImage.uri }}
          style={styles.groupImage}
        />
      )}

      
      <Text style={styles.subtitle}>Selecione os membros do grupo</Text>
      {loading ? (
        <Text>Carregando usuários...</Text>
      ) : (
        <FlatList
          data={allUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          style={styles.userList}
        />
      )}

      
      <Button title="Criar Grupo" onPress={createGroup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: hp(6),
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#007bff',
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userList: {
    marginBottom: 20,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userItemSelected: {
    backgroundColor: '#e6f7ff',
  },
  userName: {
    fontSize: 16,
  },
});

export default CreateGroupScreen;
