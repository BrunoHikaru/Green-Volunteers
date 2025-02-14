import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../firebase';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const HomeAdmin = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [pendingProjects, setPendingProjects] = useState(0);
  const [approvedProjects, setApprovedProjects] = useState(0);
  
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore(app);
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => doc.data());

        const total = usersList.length;
        const volunteers = usersList.filter(user => user.userType === 'Voluntário').length;
        const companies = usersList.filter(user => user.userType === 'Empresa').length;
        const admins = usersList.filter(user => user.userType === 'Administrador').length;

        setTotalUsers(total);
        setTotalVolunteers(volunteers);
        setTotalCompanies(companies);
        setTotalAdmins(admins);

        const dbRealtime = getDatabase(app);
        const projectsRef = ref(dbRealtime, 'projects');

        onValue(projectsRef, (snapshot) => {
          const projectsData = snapshot.val();
          const projectsList = projectsData ? Object.values(projectsData) : [];

          const totalProj = projectsList.length;
          const pendingProj = projectsList.filter(project => project.isValidated === false).length;
          const approvedProj = projectsList.filter(project => project.isValidated === true).length;

          setTotalProjects(totalProj);
          setPendingProjects(pendingProj);
          setApprovedProjects(approvedProj);
        });

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: () => {
            
            navigation.navigate('Comeco');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
       
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <TouchableOpacity onPress={handleLogout}>
            <MaterialIcons name="logout" size={28} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Gerir Utilizadores')}>
          <View style={styles.headerRow}>
            <Text style={styles.dashTitle}>Utilizadores</Text>
            <MaterialIcons name="navigate-next" size={24} color="black" />
          </View>
        </TouchableOpacity>

        <View style={styles.dashboard}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total </Text>
            <Text style={styles.cardValue}>{totalUsers}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Voluntário</Text>
            <Text style={styles.cardValue}>{totalVolunteers}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Empresa</Text>
            <Text style={styles.cardValue}>{totalCompanies}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Administrador</Text>
            <Text style={styles.cardValue}>{totalAdmins}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Gerir Projetos')}>
          <View style={styles.headerRow}>
            <Text style={styles.dashTitle}>Projetos</Text>
            <MaterialIcons name="navigate-next" size={24} color="black" />
          </View>
        </TouchableOpacity>

        <View style={styles.dashboard}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total </Text>
            <Text style={styles.cardValue}>{totalProjects}</Text>
          </View>
          <View style={{ ...styles.card, borderColor: '#fcca03', borderWidth: 1 }}>
            <Text style={styles.cardTitle}>Pendentes</Text>
            <Text style={styles.cardValue}>{pendingProjects}</Text>
          </View>
          <View style={{ ...styles.card, borderColor: '#3d8a0c', borderWidth: 1 }}>
            <Text style={styles.cardTitle}>Aprovados</Text>
            <Text style={styles.cardValue}>{approvedProjects}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: hp(5),
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(1),
    marginTop: hp(3),
    marginHorizontal: Platform.OS === 'ios' ? wp(0.35) : wp(1.2),
  },
  dashboard: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: Platform.OS === 'ios' ? RFPercentage(1.7) : RFPercentage(2.4),
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dashTitle: {
    fontSize: Platform.OS === 'ios' ? RFPercentage(2.3) : RFPercentage(3),
    fontWeight: '600',
  },
});

export default HomeAdmin;
