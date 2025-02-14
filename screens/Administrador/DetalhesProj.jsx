import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Platform, ScrollView } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DetalhesProj = ({ route }) => {
    const { projectId } = route.params;
    const [project, setProject] = useState(null);

    useEffect(() => {
        const db = getDatabase();
        const projectRef = ref(db, 'projects/' + projectId);

        const unsubscribe = onValue(projectRef, snapshot => {
            const data = snapshot.val();
            setProject(data);
        });

        return () => unsubscribe();
    }, [projectId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
    }
});

export default DetalhesProj;
