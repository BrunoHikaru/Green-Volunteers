import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, Platform, ScrollView } from 'react-native';
import { auth, database, firestore } from '../firebase'; 
import { ref, onValue } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const HomeVolunteers = () => {
  const [projects, setProjects] = useState([]);
  const [news, setNews] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
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
            .filter(key => data[key].isValidated)
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
    <TouchableOpacity style={styles.card}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.projectImage} />
      )}
      <Text style={styles.projectName}>{item.name.length > 30 ? item.name.substring(0, 30) + '...' : item.name}</Text>
      <Text style={styles.projectDescription}>{item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description}</Text>
      <Text style={styles.projectDetails}>Modo de Execução: {item.executionMode}</Text>
      <Text style={styles.projectDetails}>Data início: {formatDate(item.startDate)}</Text>
    </TouchableOpacity>
  );

  const renderNews = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.projectImage} />
      )}
      <Text style={styles.projectName}>{item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title}</Text>
      <Text style={styles.projectDescription}>{item.subtitle.length > 210 ? item.subtitle.substring(0, 210) + '...' : item.subtitle}</Text>
      <Text style={styles.projectDetails}>Data início: {formatDate(item.createdAt)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <>
          <Text style={styles.title}>
            Bem-vindo, {userData?.name || 'Voluntário'}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(7) }}>
            <Text style={{ fontSize: RFPercentage(2.35), marginBottom: hp(3), fontWeight: 'bold', marginTop: hp(5), marginLeft: Platform.OS === 'ios' ? hp(0.5) : hp(0.5) }}>Projetos Validados</Text>
            {projects.length === 0 ? (
              <Text style={{ marginLeft: hp(0.5) }}>Você ainda não criou nenhum projeto.</Text>
            ) : (
              <FlatList
                data={[...projects].reverse().slice(0, 4)}
                renderItem={renderProject}
                keyExtractor={item => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ paddingBottom: hp(1), paddingLeft: hp(0.2) }}
              />
            )}
            <Text style={{ fontSize: RFPercentage(2.35), marginBottom: hp(3), fontWeight: 'bold', marginTop: hp(5), marginLeft: Platform.OS === 'ios' ? hp(0.5) : hp(0.5) }}>Notícias</Text>
            {news.length === 0 ? (
              <Text style={{ marginLeft: hp(0.5) }}>Não há notícias disponíveis.</Text>
            ) : (
              <FlatList
                data={[...news].reverse().slice(0, 4)}
                renderItem={renderNews}
                keyExtractor={item => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ paddingBottom: hp(1), paddingLeft: hp(0.2) }}
              />
            )}
          </ScrollView>
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
    width: wp(80),
    height: Platform.OS === 'android' ? hp(35) : hp(35) + Platform.OS === 'ios' ? hp(35) : hp(35),
    marginBottom: hp(0.5),
    marginLeft: hp(0.2),
    shadowOpacity: 0.3,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  projectImage: {
    width: wp(73),
    height: hp(17),
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

export default HomeVolunteers;
