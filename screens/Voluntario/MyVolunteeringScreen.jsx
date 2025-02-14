import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, Platform, ScrollView } from 'react-native';
import { auth, database, firestore } from '../../firebase'; 
import { ref, onValue, update } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const MyVolunteeringScreen = () => {
  const [pendingProjects, setPendingProjects] = useState([]);
  const [confirmedProjects, setConfirmedProjects] = useState([]);
  const [rejectedProjects, setRejectedProjects] = useState([]);
  const [onGoingProjects, setOnGoingProjects] = useState([]);
  const [closedProjects, setCloseProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const navigation = useNavigation();

  const fetchUserCandidatures = useCallback(() => {
    if (user) {
      const userId = user.uid; 
      const projectsRef = ref(database, 'projects');

      onValue(projectsRef, snapshot => {
        const data = snapshot.val();
        if (data) {
          const pending = [];
          const confirmed = [];
          const rejected = [];
          const ongoing = [];
          const closed = [];

          const today = new Date(); 
          console.log(today)

          Object.keys(data).forEach(projectId => {
            const project = data[projectId];
            const candidaturas = project.candidaturas || {};

            Object.keys(candidaturas).forEach(async (candidaturaKey) => {
              const candidatura = candidaturas[candidaturaKey];

              if (candidatura.uid === userId) {
                const status = candidatura.status;
                const projectData = { ...project, id: projectId };

                const projectStartDate = new Date(project.startDate);
                const projectEndDate = new Date(project.endDate); 

              
                if (status === 'Confirmado' && projectStartDate.toDateString() === today.toDateString()) {
                  const candidaturaRef = ref(database, `projects/${projectId}/candidaturas/${candidaturaKey}`);
                  await update(candidaturaRef, { status: 'Em andamento' });
                  ongoing.push(projectData);
                }
                
               
                else if (status === 'Em andamento' && projectEndDate.toDateString() >= today.toDateString()) {
                  const candidaturaRef = ref(database, `projects/${projectId}/candidaturas/${candidaturaKey}`);
                  try {
                    await update(candidaturaRef, { status: 'Finalizado' });
                    projectData.status = 'Finalizado'; 
                  } catch (error) {
                    console.error('Erro ao atualizar o status para "Finalizado":', error);
                  }
                }
                
                else {
                  if (status === 'Pendente') {
                    pending.push(projectData);
                  } else if (status === 'Confirmado') {
                    confirmed.push(projectData);
                  } else if (status === 'Recusado') {
                    rejected.push(projectData);
                  } else if (status === 'Em andamento') {
                    ongoing.push(projectData);
                  } else if (status === 'Finalizado') {
                    closed.push(projectData);
                  }
                }
              }
            });
          });

          
          pending.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
          confirmed.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
          rejected.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
          ongoing.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
          closed.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

          setPendingProjects(pending);
          setConfirmedProjects(confirmed);
          setRejectedProjects(rejected);
          setOnGoingProjects(ongoing);
          setCloseProjects(closed)
        }
        setLoading(false);
      });
    }
  }, [user]);


  useFocusEffect(
    useCallback(() => {
      fetchUserCandidatures();
    }, [fetchUserCandidatures])
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderProject = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detalhes_myvolunteering', { projectId: item.id })}>

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


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: hp(10) }}>
        {loading ? (
          <Text>Carregando...</Text>
        ) : (
          <>
            <Text style={styles.title}>Meus voluntariados</Text>


            <Text style={styles.sectionTitle}>Em andamento</Text>
            {onGoingProjects.length === 0 ? (
              <Text>Você não tem projetos em andamento.</Text>
            ) : (
              <FlatList
                data={onGoingProjects}
                renderItem={renderProject}
                keyExtractor={item => item.id}
                horizontal={true} 
                showsHorizontalScrollIndicator={false}
                style={{ paddingBottom: hp(1), paddingLeft: hp(0.2) }}
              />
            )}

            <Text style={styles.sectionTitle}>Candidaturas Confirmadas</Text>
            {confirmedProjects.length === 0 ? (
              <Text>Você não tem candidaturas confirmadas.</Text>
            ) : (
              <FlatList
                data={confirmedProjects}
                renderItem={renderProject}
                keyExtractor={item => item.id}
                horizontal={true} 
                showsHorizontalScrollIndicator={false}
                style={{ paddingBottom: hp(1), paddingLeft: hp(0.2) }}
              />
            )}

            <Text style={styles.sectionTitle}>Candidaturas Pendentes</Text>
            {pendingProjects.length === 0 ? (
              <Text>Você não tem candidaturas pendentes.</Text>
            ) : (
              <FlatList
                data={pendingProjects}
                renderItem={renderProject}
                keyExtractor={item => item.id}
                horizontal={true} 
                showsHorizontalScrollIndicator={false}
                style={{ paddingBottom: hp(1), paddingLeft: hp(0.2) }}
              />
            )}

            <Text style={styles.sectionTitle}>Finalizado</Text>
            {closedProjects.length === 0 ? (
              <Text>Você não tem projetos Finalizados.</Text>
            ) : (
              <FlatList
                data={closedProjects}
                renderItem={renderProject}
                keyExtractor={item => item.id}
                horizontal={true} 
                showsHorizontalScrollIndicator={false}
                style={{ paddingBottom: hp(1), paddingLeft: hp(0.2) }}
              />
            )}




            <Text style={styles.sectionTitle}>Candidaturas Recusadas</Text>
            {rejectedProjects.length === 0 ? (
              <Text>Você não tem candidaturas recusadas.</Text>
            ) : (
              <FlatList
                data={rejectedProjects}
                renderItem={renderProject}
                keyExtractor={item => item.id}
                horizontal={true} 
                showsHorizontalScrollIndicator={false}
                style={{ paddingBottom: hp(1), paddingLeft: hp(0.2) }}
              />
            )}
          </>
        )}
      </ScrollView>
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
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    textAlign: 'justify',
    marginTop: hp(6),
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    marginBottom: hp(1),
    marginTop: hp(2),
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    elevation: 3,
    width: wp(80), 
    height: hp(35), 
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
  },
  projectName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
  },
  projectDetails: {
    fontSize: 12,
    marginTop: 5,
    color: '#333',
  },
});

export default MyVolunteeringScreen;
