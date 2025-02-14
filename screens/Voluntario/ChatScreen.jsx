import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { firestore, auth } from '../../firebase'; 
import { collection, addDoc, query, orderBy, onSnapshot, writeBatch, where, getDocs } from 'firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const ChatScreen = ({ route }) => {
  const { userId, userName, userImage } = route.params; 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const currentUserId = auth.currentUser.uid;

  useEffect(() => {
    
    const chatId = [currentUserId, userId].sort().join('_');
    const messagesRef = collection(firestore, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [userId]);

  
  const markMessagesAsRead = async () => {
    const chatId = [currentUserId, userId].sort().join('_');
    const messagesRef = collection(firestore, 'chats', chatId, 'messages');
    const q = query(messagesRef, where('receiverId', '==', currentUserId), where('read', '==', false));

    const snapshot = await getDocs(q);
    const batch = writeBatch(firestore);

    snapshot.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
  };


  useEffect(() => {
    markMessagesAsRead();
  }, [userId]);

  const handleSend = async () => {
    if (newMessage.trim() === '') return;

    const chatId = [currentUserId, userId].sort().join('_');
    const messagesRef = collection(firestore, 'chats', chatId, 'messages');

    await addDoc(messagesRef, {
      text: newMessage,
      senderId: currentUserId,
      receiverId: userId,
      createdAt: new Date(),
      read: false,
    });

    setNewMessage('');
  };

  const renderMessageItem = ({ item }) => (
    <View style={[styles.messageItem, item.senderId === currentUserId ? styles.sent : styles.received]}>
      <Text style={styles.messageText}>{item.text}</Text>
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
          style={styles.messageList}
        />
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={handleSend}>
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
    borderColor:'black'
  },
  messageList: {
    flex: 1,
  },
  messageItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
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
});

export default ChatScreen;
