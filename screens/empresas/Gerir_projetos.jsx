import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Platform, ScrollView, TouchableOpacity, Button, Alert } from 'react-native';
import { getAuth } from 'firebase/auth'; 
import { getDatabase, ref, onValue } from 'firebase/database'; 
import { getDoc, doc } from 'firebase/firestore'; 
import { RFPercentage } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { firestore } from '../../firebase'; 
import { useNavigation } from '@react-navigation/native';

const Gerir_projetos = ({ route, navigation }) => {
    const { idprojecto } = route.params;
    const [project, setProject] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [user, setUser] = useState(null); 




    
    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            setUser(currentUser);
        } else {
            console.error("Usuário não autenticado");
        }
    }, []);

    useEffect(() => {
       
        const db = getDatabase();
        const projectRef = ref(db, 'projects/' + idprojecto);

        const unsubscribeProject = onValue(projectRef, snapshot => {
            const data = snapshot.val();
            setProject(data);
        });

        
        const fetchUserData = async () => {
            try {
                if (user) {
                    console.log("Buscando dados do usuário:", user.uid); 
                    const userDoc = await getDoc(doc(firestore, 'users', user.uid)); 

                    if (userDoc.exists()) {
                        console.log("Dados do usuário encontrados:", userDoc.data());
                        setUserData(userDoc.data()); 
                    } else {
                        console.error('Nenhum documento encontrado para o usuário');
                    }
                } else {
                    console.error('Objeto user está vazio ou indefinido.');
                }
            } catch (error) {
                console.error('Erro ao buscar os dados do usuário:', error);
            } finally {
                setLoading(false); 
            }
        };

        if (user) {
            fetchUserData(); 
        }

        return () => {
            unsubscribeProject();
        };
    }, [idprojecto, user]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    
    const handleGerirPress = () => {
        if (idprojecto) {
            console.log('idprojecto:', idprojecto); 
            navigation.navigate('Visualizar_candidaturas', {
                 id_projetos: idprojecto, projectData:project.numberVacancies 
              });

              
        } else {
            console.log(idprojecto)
            Alert.alert('Erro', 'ID do projeto não disponível.');
        }
    };

    const projectCreator = () => {
        if (project && user) { 
            const userId = user.uid;  
            
            if (project.creatorId === userId) {  
                return true;  
            } else {
                return false;  
            }
        }
        return false;  
    };
    
    if (!project) {
        return (
            <View style={styles.container}>
                <Text>id projeto: ${idprojecto}</Text>
                <Text>Carregando...</Text>
            </View>
        );
    }
    
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {project.imageUrl && <Image source={{ uri: project.imageUrl }} style={styles.image} />}

                <Text style={styles.title}>{project.name}</Text>

                <Button title='Gerir' onPress={handleGerirPress} />

                <Text style={styles.nomesTitles}>Empresa: </Text>
                <Text style={styles.description}>{project.company}</Text>

                <Text style={styles.nomesTitles}>Descrição: </Text>
                <Text style={styles.description}>{project.description}</Text>

                <Text style={styles.nomesTitles}>Localidade: </Text>
                <Text style={styles.description}>{project.city}</Text>

                <Text style={styles.nomesTitles}>Campo de atuação: </Text>
                <Text style={styles.description}>{project.actionField}</Text>

                <Text style={styles.nomesTitles}>Vídeo: </Text>
                <Text style={styles.description}>{project.demonstrativeFilm}</Text>

                <Text style={styles.nomesTitles}>Objetivo de Desenvolvimento: </Text>
                <Text style={styles.description}>{project.developmentGoals}</Text>

                <Text style={styles.nomesTitles}>Data início: </Text>
                <Text style={styles.description}>{formatDate(project.startDate)}</Text>

                <Text style={styles.nomesTitles}>Data Fim: </Text>
                <Text style={styles.description}>{formatDate(project.endDate)}</Text>

                <Text style={styles.nomesTitles}>Data Limite para Inscrição: </Text>
                <Text style={styles.description}>{formatDate(project.limitDate)}</Text>

                <Text style={styles.nomesTitles}>Modo de execução: </Text>
                <Text style={styles.description}>{project.executionMode}</Text>

                <Text style={styles.nomesTitles}>Legislações: </Text>
                <Text style={styles.description}>{project.legislations}</Text>

                <Text style={styles.nomesTitles}>Vagas: </Text>
                <Text style={styles.description}>{project.numberVacancies}</Text>

                <Text style={styles.nomesTitles}>Mobilidade reduzida: </Text>
                <Text style={styles.description}>{project.reducedMobility}</Text>

                <Text style={styles.nomesTitles}>Cargo/Função: </Text>
                <Text style={styles.description}>{project.role}</Text>

                <Text style={styles.nomesTitles}>Habilidades especiais: </Text>
                <Text style={styles.description}>{project.specialSkills}</Text>

                <Text style={styles.nomesTitles}>Características do Voluntário: </Text>
                <Text style={styles.description}>{project.volunteerCharacteristic}</Text>

                {projectCreator() && (
                    <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProjectScreen', { project:project, idprojecto:idprojecto })}>
                        <Text style={styles.editText}>Editar Informações</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: hp(4),
        textAlign: 'center'
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: hp(2)
    },
    editButton: {
        borderRadius: 5,
        borderWidth: 1,
        justifyContent: 'center',
        marginHorizontal: hp(4.7),
        backgroundColor: 'gray',
        width: wp(75),
        marginTop: hp(5),
        height: hp(4)
    },
    editText: {
        color: 'white',
        textAlign: 'center',
        fontSize: Platform.OS === 'ios' ? RFPercentage(2.1) : RFPercentage(2.1) + Platform.OS === 'android' ? RFPercentage(3) : RFPercentage(3),
        marginVertical: Platform.OS === 'ios' ? hp(0.5) : hp(0.5) + Platform.OS === 'android' ? hp(-0.5) : hp(-0.5),
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    nomesTitles: {
        fontSize: Platform.OS === 'ios' ? RFPercentage(2.3) : RFPercentage(2.3) + Platform.OS === 'android' ? RFPercentage(3) : RFPercentage(3),
        fontWeight: '500',
        marginBottom: hp(0.5)
    }
});

export default Gerir_projetos;
