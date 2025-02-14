import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, FlatList, Image, Platform, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements'; // Biblioteca para Checkboxes
import { auth, database, firestore } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';

const TodosProjetos = ({ navigation }) => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [filters, setFilters] = useState({
        executionMode: [],
        category: [],
        sortOrder: null, 
    });
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
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
            const projectsRef = ref(database, 'projects');
            const unsubscribeProjects = onValue(projectsRef, snapshot => {
                const data = snapshot.val();
                const projectList = data
                    ? Object.keys(data).map(key => ({ ...data[key], id: key }))
                    : [];
                setProjects(projectList);
                setFilteredProjects(projectList);
                setLoading(false);
            });

            return () => {
                unsubscribeProjects();
            };
        }
    }, [user]);

    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    
    const applyFilters = () => {
        let filtered = projects.filter(project => {
            const executionMatch = filters.executionMode.length === 0 || filters.executionMode.includes(project.executionMode);
            const categoryMatch = filters.category.length === 0 || filters.category.includes(project.category);
            return executionMatch && categoryMatch;
        });

        
        if (filters.sortOrder === 'recent') {
            filtered = filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        } else if (filters.sortOrder === 'oldest') {
            filtered = filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        }

        setFilteredProjects(filtered);
    };

   
    const toggleFilter = (filterType, value) => {
        if (filterType === 'sortOrder') {
            setFilters(prevFilters => ({
                ...prevFilters,
                sortOrder: prevFilters.sortOrder === value ? null : value, 
            }));
        } else {
            setFilters(prevFilters => {
                const newFilters = { ...prevFilters };
                if (newFilters[filterType].includes(value)) {
                    newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
                } else {
                    newFilters[filterType].push(value);
                }
                return newFilters;
            });
        }
    };

   
    const renderProject = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detalhes_projetos', { projectId: item.id })}>
            <Image
                source={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/project.png')}
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
            {loading ? (
                <Text>Carregando...</Text>
            ) : (
                <>
                    <Text style={styles.title}>Projetos</Text>
                    
                   
                    <TouchableOpacity
                        style={styles.filterToggleButton}
                        onPress={() => setShowFilters(!showFilters)}
                    >
                        <Text style={styles.filterToggleButtonText}>
                            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                        </Text>
                    </TouchableOpacity>
                    
             
                    {showFilters && (
                        <View style={styles.filterContainer}>
                            <Text style={styles.filterTitle}>Filtros:</Text>
                            
                          
                            <CheckBox
                                title="Remoto"
                                checked={filters.executionMode.includes('Remoto')}
                                onPress={() => toggleFilter('executionMode', 'Remoto')}
                            />
                            <CheckBox
                                title="Presencial"
                                checked={filters.executionMode.includes('Presencial')}
                                onPress={() => toggleFilter('executionMode', 'Presencial')}
                            />
                            
                            

                            
                            <CheckBox
                                title="Mais Recente"
                                checked={filters.sortOrder === 'recent'}
                                onPress={() => toggleFilter('sortOrder', 'recent')}
                            />
                            <CheckBox
                                title="Mais Antigo"
                                checked={filters.sortOrder === 'oldest'}
                                onPress={() => toggleFilter('sortOrder', 'oldest')}
                            />

                            
                            <TouchableOpacity style={styles.applyFilterButton} onPress={applyFilters}>
                                <Text style={styles.applyFilterButtonText}>Aplicar Filtros</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    
                    {filteredProjects.length === 0 ? (
                        <Text>Não existem projetos disponíveis</Text>
                    ) : (
                        <FlatList
                            data={filteredProjects}
                            renderItem={renderProject}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
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
        fontSize: RFPercentage(3),
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: hp(2),
        marginTop:hp(9)
    },
    filterToggleButton: {
        backgroundColor: '#3d8a0c',
        padding: 10,
        borderRadius: 5,
        marginVertical: hp(2),
        alignItems: 'center',
    },
    filterToggleButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    filterContainer: {
        marginBottom: hp(2),
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 5,
    },
    filterTitle: {
        fontSize: RFPercentage(2.2),
        fontWeight: 'bold',
        marginBottom: hp(1),
    },
    applyFilterButton: {
        backgroundColor: '#3d8a0c',
        padding: 10,
        borderRadius: 5,
        marginTop: hp(2),
        alignItems: 'center',
    },
    applyFilterButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: hp(2),
        elevation: 3,
    },
    projectImage: {
        width: wp(85),
        height: hp(20),
        borderRadius: 10,
        marginBottom: 10,
    },
    projectName: {
        fontSize: RFPercentage(2.4),
        fontWeight: '500',
        marginBottom: hp(1),
        textAlign: 'center',
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
});

export default TodosProjetos;
