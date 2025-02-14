import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Button, Alert, TouchableOpacity, Platform } from 'react-native';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { app } from '../../firebase';
import { deleteUser } from 'firebase/auth';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import RNPickerSelect from 'react-native-picker-select';

const columnWidth = 170;

const GerirUsers = () => {
  const [users, setUsers] = useState([]);
  const [filterUserType, setFilterUserType] = useState('');
  const navigation = useNavigation();

  const fetchUsers = async () => {
    try {
      const db = getFirestore(app);
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredUsers = filterUserType ?
        usersList.filter(user => user.userType === filterUserType) :
        usersList;

      setUsers(filteredUsers);
    } catch (error) {
      console.error('Erro ao buscar utilizadores:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [filterUserType])
  );

  const handleDeleteUser = async (userId) => {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, 'users', userId));
      

      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

      Alert.alert('Sucesso', 'Usuário deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      Alert.alert('Erro', `Não foi possível deletar o usuário: ${error.message}`);
    }
  };

  const confirmDeleteUser = (userId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja deletar este usuário?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Deletar',
          onPress: () => handleDeleteUser(userId),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  
  const toggleAllowCreate = async (userId, currentAllowCreate) => {
    const newAllowCreate = currentAllowCreate === 'Sim' ? 'Não' : 'Sim';
    try {
      const db = getFirestore(app);
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, { allowCreate: newAllowCreate });

      setUsers(prevUsers => prevUsers.map(user =>
        user.id === userId ? { ...user, allowCreate: newAllowCreate } : user
      ));
    } catch (error) {
      console.error('Erro ao atualizar allowCreate:', error);
      Alert.alert('Erro', `Não foi possível atualizar o usuário: ${error.message}`);
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.cellContent]}>{item.name}</Text>
      <Text style={[styles.cell, styles.cellContent]}>{item.email}</Text>
      <Text style={[styles.cell, styles.cellContent]}>{item.userType}</Text>
      <Text style={[styles.cell, styles.cellContent]}>{item.headquarters}</Text>
      <Text style={[styles.cell, styles.cellContent]}>{item.phone}</Text>
      <Text style={[styles.cell, styles.cellContent]}>{item.socialObject}</Text>

      <TouchableOpacity
        onPress={() => toggleAllowCreate(item.id, item.allowCreate)}
        style={[styles.cell, styles.cellContent]}
      >
        
        <Text style={[styles.toggleText, item.allowCreate === 'Sim' ? styles.allowCreateYes : styles.allowCreateNo]}>
          {item.allowCreate}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => confirmDeleteUser(item.id)} style={[styles.cell, styles.cellContent]}>
        <Text style={styles.deleteButton}>Apagar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Utilizadores</Text>

      <RNPickerSelect
        onValueChange={(value) => {
          setFilterUserType(value);
          fetchUsers();
        }}
        items={[
          { label: 'Todos', value: '' },
          { label: 'Administrador', value: 'Administrador' },
          { label: 'Voluntário', value: 'Voluntário' },
          { label: 'Empresa', value: 'Empresa' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: 'Filtrar por Tipo de Utilizador', value: null }}
      />

      <Button
        title="Adicionar Utilizador"
        onPress={() => navigation.navigate('Criar Utilizador')}
      />

      <ScrollView horizontal>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={[styles.cell, styles.headerCell]}>Nome</Text>
            <Text style={[styles.cell, styles.headerCell]}>Email</Text>
            <Text style={[styles.cell, styles.headerCell]}>Tipo de Utilizador</Text>
            <Text style={[styles.cell, styles.headerCell]}>Sede</Text>
            <Text style={[styles.cell, styles.headerCell]}>Telefone</Text>
            <Text style={[styles.cell, styles.headerCell]}>Objeto Social</Text>
            <Text style={[styles.cell, styles.headerCell]}>Pode criar projetos?</Text>
            <Text style={[styles.cell, styles.headerCell]}>Ações</Text>
          </View>
          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </ScrollView>
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
    marginTop: hp(7),
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    backgroundColor: '#f8f8f8',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    width: columnWidth,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    padding: 5,
  },
  headerCell: {
    fontWeight: 'bold',
    borderBottomColor: '#000',
    borderWidth: 1,
  },
  cellContent: {
    textAlign: 'justify',
    borderWidth: 0.5,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderWidth: 0.7,
    borderRadius: 5,
    width: Platform.OS === 'ios' ? wp(35) : wp(37),
    height: Platform.OS === 'ios' ? hp(3) : hp(3) + (Platform.OS === 'android' ? hp(4) : hp(4)),
    marginVertical: hp(0.5),
    marginHorizontal: wp(1.2),
    color: 'white',
    textAlign: 'center',
    fontSize: Platform.OS === 'ios' ? RFPercentage(1.9) : RFPercentage(1.9) + (Platform.OS === 'android' ? RFPercentage(2.3) : RFPercentage(2.3)),
    fontWeight: '400',
    alignSelf: 'center',
    textAlignVertical: 'center',
  },
  allowCreateYes: {
    color: 'green', 
  },
  allowCreateNo: {
    color: 'red',  
  },
});

export default GerirUsers;
