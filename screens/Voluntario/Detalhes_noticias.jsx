import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Platform, TouchableOpacity, Share } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { getDatabase, ref, onValue } from 'firebase/database';


const NewsDetailScreen = ({ route }) => {
    const { newsId } = route.params;
    const [news, setNews] = useState(null);

    useEffect(() => {
        const db = getDatabase();
        const newsRef = ref(db, 'news/' + newsId);

        const unsubscribe = onValue(newsRef, snapshot => {
            const data = snapshot.val();
            setNews(data);
        });

        return () => unsubscribe();
    }, [newsId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const handleShare = async () => {
        const url = 'https://play.google.com/store/apps/details?id=com.brunohikaru.TrivialSimulator';

        try {
            await Share.share({
                message: `Confira esta notícia: ${news.title}\n\n${news.text.substring(0, 350)+ '...' }\n\nLeia mais em: ${url}`, 
                
                title: 'Compartilhar Notícia',
            });
        } catch (error) {
            console.error('Erro ao compartilhar:', error);
        }
    };

    if (!news) {
        return (
            <View style={styles.container}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: hp(20) }}>
            <View style={styles.newsContainer}>
                <Image
                    source={{ uri: news.imageUrl }}
                    style={styles.image}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{news.title}</Text>
                    <Text style={styles.subtitle}>{news.subtitle}</Text>
                    <Text style={styles.content}>{news.text}</Text>
                    <Text style={styles.date}>Publicado em: {formatDate(news.createdAt)}</Text>
                </View>
                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                    <Text style={styles.shareButtonText}>Compartilhar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        padding: wp(5),
        paddingBottom: hp(50),
    },
    image: {
        width: '100%',
        height: hp(25),
        borderRadius: 10,
        marginBottom: hp(2),
    },
    textContainer: {
      marginHorizontal:wp(1),
      textAlign:'justify'
    },
    title: {
        fontSize: RFPercentage(2.7),
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: hp(1.5),
    },
    subtitle: {
        fontSize: RFPercentage(2),
        color: '#555',
        marginBottom: hp(5),
        textAlign: 'center',
    },
    date: {
        fontSize: RFPercentage(2),
        color: '#888',
        marginBottom: hp(3),
    },
    content: {
        fontSize: RFPercentage(2.1),
        color: '#333',
        lineHeight: 1.5 * RFPercentage(2.2),
        textAlign: 'justify',
    },
    newsContainer: {
        padding: wp(3.5),
        marginHorizontal: hp(0.5),
    },
    shareButton: {
        backgroundColor: '#007bff',
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(5),
        borderRadius: 10,
        alignItems: 'center',
        marginTop: hp(3),
    },
    shareButtonText: {
        color: '#fff',
        fontSize: RFPercentage(2.2),
        fontWeight: 'bold',
    },
});

export default NewsDetailScreen;
