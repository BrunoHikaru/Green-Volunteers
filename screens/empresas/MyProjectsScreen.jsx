import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, Platform, ScrollView, Alert } from 'react-native';
import { auth, database, firestore } from '../../firebase'; 
import { ref, onValue } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';

const MyProjectsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [news, setNews] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const user = auth.currentUser;

  const fetchUserData = async () => {
    try {
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.error('Nenhum documento encontrado para o usuário');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar os dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  useEffect(() => {
    if (user) {
      const userId = user.uid;

      
      const projectsRef = ref(database, 'projects');
      const unsubscribeProjects = onValue(projectsRef, snapshot => {
        const data = snapshot.val();
        const projectList = data
          ? Object.keys(data)
            .filter(key => data[key].creatorId === userId && data[key].isValidated)
            .map(key => ({ ...data[key], id: key }))
          : [];
        setProjects(projectList);
        setLoading(false);
      });

      
      const newsRef = ref(database, 'news');
      const unsubscribeNews = onValue(newsRef, snapshot => {
        const data = snapshot.val();
        const newsList = data
          ? Object.keys(data).map(key => ({ ...data[key], id: key })) 
          : [];
        setNews(newsList);
        setLoading(false);
      });

      return () => {
        unsubscribeProjects();
        unsubscribeNews();
      };
    }
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderProject = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Gerir_projetos', { idprojecto: item.id })}>
      <Image
        source={
          item.imageUrl
            ? { uri: item.imageUrl }
            : require('../../assets/project.png')
        }
        style={styles.projectImage}
      />
      <Text style={styles.projectName}>{item.name.length > 30 ? item.name.substring(0, 30) + '...' : item.name}</Text>
      <Text style={styles.projectDescription} numberOfLines={1} ellipsizeMode='tail'>{item.description}</Text>
      <Text style={styles.projectDetails}>Modo de Execução: {item.executionMode}</Text>
      <Text style={styles.projectDetails}>Data início: {formatDate(item.startDate)}</Text>
    </TouchableOpacity>
  );

  const handleUpdate = (newData) => {
    setUserData(newData);
  };

  const handleCreateProject = () => {
    if (userData?.allowCreate === 'Sim') {
      navigation.navigate('CreateProjectScreen', { userData, onUpdate: handleUpdate })
    } else {
      
      Alert.alert(
        "Acesso Negado",
        "Você não pode criar projetos no momento.",
        [{ text: "OK", onPress: () => console.log("Popup fechado") }]
      );
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <>
          <Text style={styles.title}>
            Meus projetos
          </Text>

          <TouchableOpacity style={styles.buttonCriar} onPress={handleCreateProject}>
            <Text style={{ textAlign: 'center', color: 'white', fontSize: RFPercentage(2) }}>Criar Projeto</Text>
          </TouchableOpacity>

          
            <Text style={{ fontSize: RFPercentage(2.35), marginBottom: hp(3), fontWeight: 'bold', marginTop: hp(5), marginLeft: Platform.OS === 'ios' ? hp(0.5) : hp(0.5) }}>Todos os seus voluntariados</Text>
            {projects.length === 0 ? (
              <Text style={{ marginLeft: hp(0.5) }}>Você ainda não criou nenhum voluntariado.</Text>
            ) : (
              <FlatList
                data={[...projects].reverse()}
                renderItem={renderProject}
                keyExtractor={item => item.id}
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                style={{ paddingTop: hp(0.), paddingBottom: hp(1), paddingLeft: hp(0.2) }}
              />
            )}
          
        </>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: hp(2),
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: Platform.OS === 'ios' ? RFPercentage(2.3) : RFPercentage(2.3) + Platform.OS === 'ios' ? RFPercentage(3) : RFPercentage(3),
    fontWeight: 'bold',
    textAlign: 'justify',
    marginTop: hp(9),
    marginLeft: hp(0.5)
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    elevation: 3,
    width: wp(90),
    height: Platform.OS === 'android' ? hp(38) : hp(38) + Platform.OS === 'ios' ? hp(38) : hp(38),
    marginBottom: hp(2),
    marginLeft: hp(0.2),
    shadowOpacity: 0.3,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  projectImage: {
    width: wp(85),
    height: hp(20),
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: Platform.OS === 'ios' ? hp(0) : hp(0) + Platform.OS === 'android' ? hp(-0.7) : hp(-0.7)
  },
  projectName: {
    fontSize: RFPercentage(2.4),
    fontWeight: '500',
    marginBottom: hp(1),
    textAlign: 'center'
  },
  projectDescription: {
    fontSize: 14,
    marginTop: 5,
    color: '#666',
  },
  projectDetails: {
    fontSize: 12,
    marginTop: 5,
    color: '#333',
  },
  buttonCriar: {
    backgroundColor: '#3d8a0c',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    borderColor: 'black',
    marginBottom: hp(3),
    borderWidth: 1,

  }
});

export default MyProjectsScreen;
