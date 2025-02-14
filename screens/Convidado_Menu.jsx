import { Text, View, StyleSheet, TouchableOpacity, Image, StatusBar, Platform} from 'react-native';
import React,{useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { LinearGradient } from 'expo-linear-gradient';



const Convidado_Menu =()=>{
  

  const navigation=useNavigation();

  const handlenavigation = () => {
    navigation.navigate('Login');
  };

  const handlenavigation3 = () => {
    navigation.navigate('Informação');
  };
  
  const handlenavigation2 = () => {
    navigation.navigate('Register');
  };

  const handlenavigation4 = () => {
    navigation.navigate('RegisterCompany');
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

  return (
    <View style={styles.container}>
      
      <View>
        <Image source={require('../assets/leaf.png')} style={styles.logo}/>
      </View>
      <Text style={styles.text}>Escolha a opção que deseja</Text>
      <TouchableOpacity onPress={handlenavigation} >
        <LinearGradient
          colors={['#ffffff', '#8ccc18']}
          style={[styles.button, {width: wp(80)}]} 
          start={[0, 1.25]}
          end={[0, 0]}
        >
          <Text style={styles.buttonText}>Login</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlenavigation2} >
        <LinearGradient
          colors={['#ffffff', '#8ccc18']}
          style={[styles.button, {width: wp(80)}]} 
          start={[0, 1.25]}
          end={[0, 0]}
        >
          <Text style={styles.buttonText}>Quero ser um Voluntário</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlenavigation4} >
        <LinearGradient
          colors={['#ffffff', '#8ccc18']}
          style={[styles.button, {width: wp(80)}]} 
          start={[0, 1.25]}
          end={[0, 0]}
        >
          <Text style={styles.buttonText}>Preciso de voluntários</Text>
        </LinearGradient>
      </TouchableOpacity>


      <TouchableOpacity onPress={handlenavigation3} >
        <LinearGradient
          colors={['#ffffff', '#8ccc18']}
          style={[styles.button, {width: wp(80)}]} 
          start={[0, 1.25]}
          end={[0, 0]}
        >
          <Text style={styles.buttonText}>O que é um Voluntariado ?</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      <Image source={require('../assets/logoGV.png')} style={styles.logoImage}/>
      <StatusBar barStyle="default"/>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECF87F',
  },
  button:{
    borderRadius: wp(2),
    
    borderWidth: 1,
    marginVertical: hp(3),
    paddingVertical: hp(1),
    justifyContent: 'center', 
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
    }),
  },
  buttonText:{
    color: 'black',
    fontSize: RFPercentage(3),
    textAlign: 'center',
  },
  text:{
    color: 'black',
    fontSize: RFPercentage(3),
    textAlign: 'center',
    marginBottom: hp(4),
    fontWeight: 'bold',
    marginTop:hp(3)
    
  },
  logo:{
    width: wp(100),
    height: hp(30),
    resizeMode: 'stretch',
    borderWidth: wp(0.5),
    borderColor: 'black',
    marginTop: hp(-26),
    marginBottom: hp(3),
    borderBottomLeftRadius:wp(25),
    borderBottomRightRadius:wp(25),
  },
  buttonContainer: {
    borderRadius: wp(2),
    marginVertical: hp(2),
    width: wp(80),
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
    }),
  },
  logoImage:{
    width: wp(50),
    height: hp(15),
    resizeMode: 'stretch',
    marginBottom:hp(-6),
    marginTop:hp(6),
  }
});

export default Convidado_Menu;
