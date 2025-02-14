import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, Platform, ScrollView, Alert, Modal, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { auth, database, firestore } from '../../firebase'; 
import { ref, onValue } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import AntDesign from '@expo/vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome'; 

export const Home_empresas = () => {
  const [projects, setProjects] = useState([]);
  const [news, setNews] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null); 
  const user = auth.currentUser;
  const navigation = useNavigation();
  const [configurationModalVisible, setConfigurationModalVisible] = useState(false);


  const toggleConfigurationModal = () => {
    setConfigurationModalVisible(!configurationModalVisible);
  }

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

  const renderNews = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detalhes_noticias', { newsId: item.id })}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.projectImage} />
      )}
      <Text style={styles.projectName} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
      <Text style={styles.projectDescription} numberOfLines={1} ellipsizeMode='tail'>{item.subtitle}</Text>
      <Text style={styles.projectDetails}>Data de publicação: {formatDate(item.createdAt)}</Text>
    </TouchableOpacity>
  );

  const rotation = useRef(new Animated.Value(0)).current; 

  
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });


  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 2,
        duration: 5000, 
        easing: Easing.linear,
        useNativeDriver: true, 

      })
    ).start();
  };

  useEffect(() => {
    startRotation(); 
  }, []);



  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>
              Bem-vindo, {userData?.name.split(' ')[0] || 'Empresa'}
            </Text>
            <TouchableOpacity onPress={toggleConfigurationModal}>
              <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                <Icon name="cog" size={24} color="#333" />
              </Animated.View>
            </TouchableOpacity>
          </View>


          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(7) }}>
          <View style={styles.directionFlow}>
              <Text style={{ fontSize: RFPercentage(2.35), marginBottom: hp(3), fontWeight: 'bold', marginTop: hp(5), marginLeft: Platform.OS === 'ios' ? hp(0.5) : hp(0.5) }}>Projetos</Text>
              <TouchableOpacity onPress={() => navigation.navigate('TodosProjetos')}>
                <Text style={{ textDecorationLine: 'underline', marginBottom: hp(3), fontWeight: 'semibold', marginTop: hp(5.5), marginLeft: Platform.OS === 'ios' ? hp(7) : hp(27.5) }}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            {projects.length === 0 ? (
              <Text>Você ainda não criou nenhum projeto.</Text>
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
            <View style={styles.directionFlow}>

              <Text style={{ fontSize: RFPercentage(2.35), marginBottom: hp(3), fontWeight: 'bold', marginTop: hp(5), marginLeft: Platform.OS === 'ios' ? hp(0.5) : hp(0.5) }}>Notícias</Text>
              <TouchableOpacity onPress={() => navigation.navigate('TodasNoticias')}>
                <Text style={{ textDecorationLine: 'underline', marginBottom: hp(3), fontWeight: 'semibold', marginTop: hp(5.5), marginLeft: Platform.OS === 'ios' ? hp(7) : hp(27.5) }}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            {news.length === 0 ? (
              <Text>Não há notícias disponíveis.</Text>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={configurationModalVisible}
        onRequestClose={toggleConfigurationModal}

      >

        <TouchableWithoutFeedback onPress={toggleConfigurationModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={toggleConfigurationModal} style={{ right: Platform.OS === 'ios' ? hp(-11) : hp(-11), marginBottom: Platform.OS === 'ios' ? hp(1) : hp(2), marginTop: hp(-0.7) }}>
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.politicaButton} onPress={() => WebBrowser.openBrowserAsync('https://intellion.pt/politica-de-privacidade-green-volunteers/')}>
                <Text style={styles.modalText}>Politíca de Privacidade</Text>
              </TouchableOpacity>


              <TouchableOpacity style={styles.litigioButton} onPress={() => WebBrowser.openBrowserAsync('https://intellion.pt/contact/')}>
                <Text style={styles.modalText}>Suporte</Text>
              </TouchableOpacity>

            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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

    marginLeft: Platform.OS === 'ios' ? hp(0.5) : hp(0.5)
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
    padding: 7,
    borderRadius: 5,
    marginTop: 20,
    borderColor: 'black',
    marginBottom: hp(3),
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(9),
    marginBottom: hp(2),
  },
  modalView: {
    margin: wp(5),
    marginHorizontal: wp(10),
    backgroundColor: 'white',
    borderRadius: wp(5),
    padding: wp(3),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: hp(0.5),
    textAlign: 'justify',
    fontSize: wp(4),
  },
  politicaButton: {
    backgroundColor: 'lightgray',
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    borderRadius: 13,
    alignSelf: 'center',
    marginVertical: hp(1),
  },
  litigioButton: {
    backgroundColor: 'lightgray',
    paddingVertical: hp(1),
    paddingHorizontal: wp(19),
    borderRadius: 13,
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: hp(1),

  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  directionFlow: {
    flexDirection: 'row'
  }

});

export default Home_empresas;
