import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Visualizar_candidaturas = ({ route }) => {
    const { id_projetos, projectData } = route.params;
    console.log('id_projetos recebido na tela de candidaturas:', id_projetos);

    const [candidaturas, setCandidaturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [candidateData, setCandidateData] = useState([]);
    const [confirmedCount, setConfirmedCount] = useState(0);

    useEffect(() => {
        const db = getDatabase();
        const candidaturasRef = ref(db, `projects/${id_projetos}/candidaturas`);
    
        console.log(`Lendo candidaturas de: projects/${id_projetos}/candidaturas`); 
    
        const unsubscribe = onValue(candidaturasRef, snapshot => {
            const data = snapshot.val();
            console.log('Dados de candidaturas recebidos:', data);
    
            if (data) {
               
                const candidaturasArray = Object.keys(data).map(index => ({
                    index, 
                    ...data[index]
                }));
                setCandidaturas(candidaturasArray);
            } else {
                Alert.alert('Atenção', 'Nenhuma candidatura encontrada para este projeto.');
            }
            setLoading(false);
        }, (error) => {
            console.error('Erro ao ler as candidaturas:', error);
            Alert.alert('Erro', 'Houve um erro ao tentar carregar as candidaturas.');
        });
    
        return () => unsubscribe();
    }, [id_projetos]);
    

    useEffect(() => {
        const fetchCandidateData = async () => {
            const candidateDetails = [];
            let confirmedCounter = 0;
            try {
                for (const candidatura of candidaturas) {
                    const { uid, status } = candidatura;
                    console.log('Buscando dados do candidato com UID:', uid); 

                    const candidateDoc = await getDoc(doc(firestore, 'users', uid));
                    if (candidateDoc.exists()) {
                        console.log('Dados do candidato encontrados:', candidateDoc.data()); 
                        candidateDetails.push({ id: uid, status, ...candidateDoc.data() });
                        if (status === 'Confirmado') {
                            confirmedCounter++;
                        }
                    } else {
                        console.error(`Nenhum documento encontrado para o candidato com UID: ${uid}`);
                    }
                }
                setConfirmedCount(confirmedCounter);
                setCandidateData(candidateDetails);
            } catch (error) {
                console.error('Erro ao buscar os dados dos candidatos:', error);
            }
        };

        if (candidaturas.length > 0) {
            fetchCandidateData();
        } else {
            console.log("Nenhuma candidatura encontrada na lista."); 
        }
    }, [candidaturas]);

    const updateStatus = (index, newStatus) => {
        Alert.alert(
            "Confirmação",
            `Você tem certeza que deseja alterar para ${newStatus.toLowerCase()} esta candidatura?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Confirmar",
                    onPress: async () => {
                        const db = getDatabase();
                        const candidaturasRef = ref(db, `projects/${id_projetos}/candidaturas/${index}`);
                        try {
                            await update(candidaturasRef, { status: newStatus });

                            if (newStatus === 'Confirmado') {
                                setConfirmedCount(prev => prev + 1);
                            } else if (candidaturas.find(c => c.index === index)?.status === 'Confirmado') {
                                setConfirmedCount(prev => prev - 1);
                            }

                            Alert.alert('Sucesso', `Candidatura ${newStatus}!`);
                        } catch (error) {
                            console.error('Erro ao atualizar o status:', error);
                            Alert.alert('Erro', 'Não foi possível atualizar o status da candidatura.');
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text>Carregando candidaturas...</Text>
            </View>
        );
    }

    if (candidateData.length === 0) {
        console.log("Nenhum dado de candidato encontrado para exibir."); 
        return (
            <View style={styles.container}>
                <Text>Nenhuma candidatura disponível.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Candidaturas {confirmedCount}/{projectData}</Text>
            {candidateData.map((candidate, idx) => (
                <View key={candidate.id} style={styles.candidateCard}>
                    <Text style={styles.candidateTitle}>Candidato {idx + 1}</Text>
                    <Text style={styles.candidateInfo}>Nome: {candidate.name}</Text>
                    <Text style={styles.candidateInfo}>Email: {candidate.email}</Text>
                    <Text style={styles.candidateInfo}>Status: {candidate.status}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => updateStatus(candidaturas[idx].index, 'Confirmado')}>
                            <Text style={styles.confirmarButton}>Confirmar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => updateStatus(candidaturas[idx].index, 'Recusado')}>
                            <Text style={styles.recusarButton}>Recusar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    candidateCard: { backgroundColor: '#f9f9f9', padding: 20, marginBottom: 20, borderRadius: 10, elevation: 3 },
    candidateTitle: { fontSize: RFPercentage(3), fontWeight: 'bold', marginBottom: 10 },
    candidateInfo: { fontSize: RFPercentage(2), color: '#333', marginBottom: hp(1) },
    title: { fontSize: RFPercentage(3), fontWeight: 'bold', marginBottom: hp(2), marginTop: hp(5), textAlign: 'center' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    confirmarButton: { backgroundColor: '#4caf50', color: '#fff', borderRadius: 5, padding: 10, width: wp(30), textAlign: 'center' },
    recusarButton: { backgroundColor: '#f44336', color: '#fff', borderRadius: 5, padding: 10, width: wp(30), textAlign: 'center' },
});

export default Visualizar_candidaturas;
