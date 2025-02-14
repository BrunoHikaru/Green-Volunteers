import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Platform, ScrollView, Button, Alert } from 'react-native';
import { getAuth } from 'firebase/auth'; 
import { getDatabase, ref, onValue, update,get } from 'firebase/database'; 
import { getDoc, doc } from 'firebase/firestore'; 
import { RFPercentage } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { firestore } from '../../firebase'; 

const DetalhesProj = ({ route }) => {
    const { projectId } = route.params;
    const [project, setProject] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [user, setUser] = useState(null); 
    const [isApplyDisabled, setIsApplyDisabled] = useState(false); 

    
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
        const projectRef = ref(db, 'projects/' + projectId);

        const unsubscribeProject = onValue(projectRef, snapshot => {
            const data = snapshot.val();
            setProject(data);

           
            if (data.limitDate) {
                const currentDate = new Date(); 
                const limitDate = new Date(data.limitDate); 

                
                if (currentDate > limitDate) {
                    setIsApplyDisabled(true);
                }
            }
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
    }, [projectId, user]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const handleApply = async () => {
        if (loading) {
            Alert.alert('Aguarde', 'Carregando as informações do usuário...');
            return;
        }
    
        if (!userData) {
            console.log("Erro: Dados do usuário não foram carregados."); 
            Alert.alert('Erro', 'Informações do usuário não estão carregadas.');
            return;
        }
    
        try {
            const db = getDatabase();
            const projectRef = ref(db, `projects/${projectId}/candidaturas`);
    
            
            const snapshot = await get(projectRef);
            const candidaturasExistentes = snapshot.val() || [];
    
          
            const jaCandidatado = candidaturasExistentes.some(candidatura => candidatura.uid === user.uid);
    
            if (jaCandidatado) {
                Alert.alert('Atenção', 'Você já se candidatou para este projeto.');
            } else {
                
                const novaCandidatura = { uid: user.uid, status: 'Pendente' };
                const novasCandidaturas = [novaCandidatura, ...candidaturasExistentes];
    
                await update(ref(db, `projects/${projectId}`), {
                    candidaturas: novasCandidaturas
                });
    
                Alert.alert('Sucesso', 'Você se candidatou com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao submeter candidatura:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao submeter sua candidatura.');
        }
    };
    

    if (!project) {
        return (
            <View style={styles.container}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {project.imageUrl && <Image source={{ uri: project.imageUrl }} style={styles.image} />}

                <Text style={styles.title}>{project.name}</Text>

                
                {!isApplyDisabled && (
                    <Button
                        title='Candidatar-se'
                        onPress={handleApply}
                    />
                )}

                
                {isApplyDisabled && (
                    <Text style={styles.warningText}>A data limite para candidaturas já passou.</Text>
                )}

               
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
    },
    warningText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center'
    }
});

export default DetalhesProj;
