import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { firestore, auth } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; 

const CommunityScreen = ({ navigation }) => {
  const [recentUsers, setRecentUsers] = useState([]); 
  const [otherUsers, setOtherUsers] = useState([]); 
  const [groups, setGroups] = useState([]); 
  const [loading, setLoading] = useState(true);
  const currentUserId = auth.currentUser.uid;

 
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const usersCollection = await getDocs(collection(firestore, 'users'));
      const usersList = usersCollection.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          unreadCount: 0,
        }))
        .filter(user => user.userType === 'Voluntário' || user.userType === 'Empresa');

      const recent = [];
      const others = [];

      await Promise.all(usersList.map(async (user) => {
        const chatId = [currentUserId, user.id].sort().join('_');
        const messagesRef = collection(firestore, 'chats', chatId, 'messages');
        const q = query(messagesRef, where('receiverId', '==', currentUserId), where('read', '==', false));

        const snapshot = await getDocs(q);
        const unreadCount = snapshot.size;

        const hasMessages = (await getDocs(messagesRef)).size > 0;

        if (hasMessages) {
          recent.push({ ...user, unreadCount });
        } else {
          others.push({ ...user, unreadCount });
        }
      }));

      setRecentUsers(recent);
      setOtherUsers(others);

    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  
  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const groupsCollection = await getDocs(
        query(
          collection(firestore, 'groups'),
          where('members', 'array-contains', currentUserId)
        )
      );
      
      const groupsList = groupsCollection.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        unreadCount: 0, 
      }));

      setGroups(groupsList);
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

 
  useFocusEffect(
    useCallback(() => {
      fetchUsers();
      fetchGroups();
    }, [fetchUsers, fetchGroups])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{marginTop: hp(10)}} />;
  }

 
  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('ChatScreen', { userId: item.id, userName: item.name, userImage: item.photoURL })}
    >
      <View style={styles.userInfo}>
        <Image
          source={item.photoURL ? { uri: item.photoURL } : require('../../assets/profile.png')}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{item.name} ({item.userType})</Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  
  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('GroupChatScreen', { groupId: item.id, groupName: item.groupName })}
    >
      <View style={styles.userInfo}>
        <Image
          source={require('../../assets/profile.png')} 
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{item.groupName}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comunidade</Text>

      
      {groups.length > 0 && (
        <>
          <Text style={styles.subtitle}>Grupos</Text>
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={renderGroupItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{marginBottom:hp(2), paddingBottom:hp(45)}}
          />
        </>
      )}

     
      {recentUsers.length > 0 && (
        <>
          <Text style={styles.subtitle}>Mais recentes</Text>
          <FlatList
            data={recentUsers}
            keyExtractor={(item) => item.id}
            renderItem={renderUserItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{marginBottom:hp(2), paddingBottom:hp(45)}}
          />
        </>
      )}

      
      {otherUsers.length > 0 && (
        <>
          <Text style={styles.subtitle}>Outros usuários</Text>
          <FlatList
            data={otherUsers}
            keyExtractor={(item) => item.id}
            renderItem={renderUserItem}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('CreateGroupScreen')} 
      >
        <Icon name="add-circle" size={60} color="#007bff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: hp(5),
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: 'white',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CommunityScreen;
