import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';
import { getDatabase, ref, onValue, update, remove } from 'firebase/database';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const AdminProjectScreen = () => {
  const [projects, setProjects] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const db = getDatabase();
    const projectsRef = ref(db, 'projects');

    const unsubscribe = onValue(projectsRef, snapshot => {
      const data = snapshot.val();
      const projectList = data
        ? Object.keys(data).filter(key => !data[key].isValidated).map(key => ({ ...data[key], id: key }))
        : [];
      setProjects(projectList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const validateProject = async (projectId, isValidated) => {
    const db = getDatabase();
    const projectRef = ref(db, 'projects/' + projectId);

    if (isValidated) {
      
      await update(projectRef, { isValidated });
    } else {
     
      await deleteProject(projectId);
    }
  };

  const deleteProject = async (projectId) => {
    const db = getDatabase();
    const projectRef = ref(db, 'projects/' + projectId);

    try {
      await remove(projectRef);
      console.log('Projeto excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir o projeto: ', error);
    }
  };

  const renderProject = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detalhes', { projectId: item.id })}
    >
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.projectImage} />
      )}
      <Text style={styles.projectName}>{item.name}</Text>
      <Text style={styles.projectDescription}>{item.description}</Text>

      <TouchableOpacity onPress={() => validateProject(item.id, true)} style={styles.aprovarButton}>
        <Text style={{color:'white'}}>Aprovar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => validateProject(item.id, false)} style={styles.rejeitarButton}>
        <Text style={{color:'white'}}>Rejeitar</Text>
      </TouchableOpacity>

    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projetos Pendentes de Validação</Text>
      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop:hp(9)
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign:'center',
    marginVertical:hp(0.5)
  },
  projectDescription: {
    fontSize: 14,
    marginTop: 5,
    color: '#666',
    marginBottom:hp(2)
  },
  projectImage: {
    width: Platform.OS==='ios'?wp(81.5):wp(81.5)+Platform.OS==='android'?wp(80):wp(80),
    height: hp(17),
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: Platform.OS === 'ios' ? hp(0) : hp(0) + (Platform.OS === 'android' ? hp(-0.7) : hp(-0.7)),
  },
  aprovarButton:{
    backgroundColor: 'green',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',

  },
  rejeitarButton:{
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    
  }
});

export default AdminProjectScreen;