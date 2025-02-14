import React, { useEffect } from 'react';
import { Text, View, ImageBackground, StyleSheet, Image, TouchableWithoutFeedback, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from "react-native-responsive-fontsize";

const Comeco = () => {
  const navigation = useNavigation();
  const moveAnimation = new Animated.Value(0); 

  const handleImageClick = () => {
    navigation.navigate('Convidado_Menu');
  };

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none"
      }
    });
    return () => navigation.getParent()?.setOptions({
      tabBarStyle: undefined
    });
  }, [navigation]);

  useEffect(() => {
    
    Animated.loop(
      Animated.timing(moveAnimation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true
      })
    ).start();
  }, []);

  const interpolatedRotateAnimation = moveAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <ImageBackground
      source={require('../assets/volunteer.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Bem-Vindo ao {'\n'}Green Volunteers
          </Text>
          <Text style={styles.secondText}>
            Siga para o menu
          </Text>
        </View>
        <TouchableWithoutFeedback onPress={handleImageClick} underlayColor="transparent">
          <Image source={require('../assets/next_icon_bright.png')} style={styles.imageIcon} />
        </TouchableWithoutFeedback>
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.4)']}
          style={styles.gradient}
        />
        
        <Animated.View style={[styles.foliageContainer, { transform: [{ rotate: interpolatedRotateAnimation }] }]}>
          <Image source={require('../assets/folhas.png')} style={styles.foliage} />
        </Animated.View>
        
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'flex-start', 
  },
  textContainer: {
    marginLeft: wp(8), 
    marginTop: hp(-30),
  },
  text: {
    color: 'white',
    fontSize: RFPercentage(4),
    fontWeight: 'bold',
    marginBottom: hp(2), 
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  imageIcon: {
    height: hp(7),
    width: hp(7),
    marginVertical: hp(7),
    marginLeft: wp(8), 
    borderColor: 'white',
    zIndex: 1,
  },
  secondText: {
    color: '#A9A9A0',
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    textAlign: 'left', 
  },
  foliageContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foliage: {
    width: hp(10),
    height: hp(10),
    resizeMode: 'contain',
    
  },
});

export default Comeco;
