import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { firestore, auth } from '../../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const GroupChatScreen = ({ route }) => {
    const { groupId, groupName } = route.params;
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [userNames, setUserNames] = useState({});
    const currentUserId = auth.currentUser.uid;

    
    const fetchUserName = async (userId) => {
        if (userNames[userId]) {
            return;
        }
        const userDoc = await getDoc(doc(firestore, 'users', userId));
        if (userDoc.exists()) {
            setUserNames((prevUserNames) => ({
                ...prevUserNames,
                [userId]: userDoc.data().name,
            }));
        }
    };

    
    useEffect(() => {
        const messagesRef = collection(firestore, 'groups', groupId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messagesList = snapshot.docs.map(async (doc) => {
                const messageData = doc.data();
                await fetchUserName(messageData.senderId);
                return {
                    id: doc.id,
                    ...messageData,
                };
            });
            Promise.all(messagesList).then((resolvedMessages) => {
                setMessages(resolvedMessages);
            });
        });

        return () => unsubscribe();
    }, [groupId]);

    
    const sendMessage = async () => {
        if (messageText.trim() === '') return;

        const message = {
            senderId: currentUserId,
            content: messageText,
            timestamp: new Date(),
            readBy: [currentUserId],
        };

        await addDoc(collection(firestore, 'groups', groupId, 'messages'), message);
        setMessageText('');
    };

    
    const renderMessageItem = ({ item }) => (
        <View style={[styles.messageItem, item.senderId === currentUserId ? styles.sent : styles.received]}>
            <Text style={styles.messageText}>{item.content}</Text>
            <Text style={styles.senderName}>
                {item.senderId === currentUserId ? 'Você' : userNames[item.senderId] || 'Desconhecido'}
            </Text>
        </View>
    );

    return (

        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} 
            keyboardVerticalOffset={90} 
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessageItem}
                />
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={messageText}
                    onChangeText={setMessageText}
                    placeholder="Digite sua mensagem..."
                />

                <TouchableOpacity onPress={sendMessage}>
                    <MaterialCommunityIcons name="send-circle" size={41} color="green" />
                </TouchableOpacity>


            </View>

        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    messageItem: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        maxWidth: '80%', 
    },
    sent: {
        backgroundColor: '#DCF8C6', 
        alignSelf: 'flex-end', 
    },
    received: {
        backgroundColor: '#ECECEC', 
        alignSelf: 'flex-start', 
    },
    messageText: {
        fontSize: 16,
    },
    senderName: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: hp(2),
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginRight: 10,
        borderRadius: 8,
        borderColor: 'black'
    },
});

export default GroupChatScreen;