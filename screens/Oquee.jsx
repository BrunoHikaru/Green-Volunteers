import { Text, View, StyleSheet, Image, ScrollView, Platform } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';


const Oquee =()=>{
    const navigation=useNavigation()
 
  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
      </View>
    );
  };

    return (
      <View>
        <View style={styles.header}>
          <Text style={{textAlign: 'center', fontSize: wp(5), fontWeight: 'bold', color: 'white', marginTop:  Platform.OS==='android'?hp(4):hp(4)+ Platform.OS==='ios'?hp(15):hp(5),}}>O que é ?</Text>
        </View>
        <ScrollView contentContainerStyle={{paddingBottom: hp(30)}} showsVerticalScrollIndicator={false}>
          <View>
            <Text style={{fontSize: wp(5), textAlign: 'center', fontWeight: 'bold', marginTop: hp(4), marginHorizontal:wp(4)}}>O que é ser um voluntário ?</Text>
            <Text style={{fontSize: wp(4), textAlign: 'justify', fontWeight: 'normal', marginTop: hp(3), marginHorizontal:wp(4)}}>
Ser um voluntário envolve dedicar seu tempo, habilidades e esforços para ajudar os outros, sem esperar remuneração financeira em troca. Os voluntários geralmente se envolvem em atividades de caridade, organizações sem fins lucrativos, eventos comunitários ou projetos sociais para contribuir positivamente para a sociedade. Ser um voluntário pode oferecer uma variedade de experiências significativas e oportunidades de crescimento pessoal.{'\n \n'}
            </Text>
          </View>
          <Image source={require('../assets/plantingtrees.png')} style={styles.image}/>
          <View>
            <Text style={styles.sectionTitle}> {'\n'}O que você vai encontrar aqui ?</Text>
            <Text style={styles.head}>1. Oportunidades de Voluntariado:</Text>
            <Text style={styles.bulletText}>A aplicação oferece uma variedade de oportunidades de voluntariado em diversas áreas, permitindo que os usuários escolham causas que são significativas para eles.</Text>
            <Text style={styles.head}>2. Anúncios de Vagas para Voluntários:</Text>
            <Text style={styles.bulletText}>Empresas e organizações podem anunciar suas necessidades de voluntários, descrevendo os projetos disponíveis, os requisitos e as habilidades desejadas. Isso proporciona aos usuários uma visão clara das oportunidades disponíveis.</Text>
            <Text style={styles.head}>3. Processo de Candidatura Simples:</Text>
            <Text style={styles.bulletText}>Os usuários podem se candidatar facilmente às vagas de voluntariado que mais os interessam através de um processo de candidatura simples e direto na própria aplicação.</Text>
            <Text style={styles.head}>4. Perfil do Voluntário:</Text>
            <Text style={styles.bulletText}>Cada usuário pode criar um perfil detalhado, destacando suas habilidades, interesses e experiências passadas de voluntariado. Isso ajuda a melhorar a correspondência entre voluntários e oportunidades.</Text>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
                <Text style={styles.gobackButton}>Voltar</Text>
            </TouchableOpacity>
        
          </View>
          
        </ScrollView>
      
    
      </View>
    )
  
}

const styles = StyleSheet.create({
  header:{
    width: wp(100),
    height: hp(13),

    borderWidth: wp(0.5),
    borderColor: 'black',
    marginTop: hp(0),
    marginBottom: hp(3),
    borderBottomLeftRadius:wp(7),
    borderBottomRightRadius:wp(7),
    backgroundColor: '#3D550C',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5, 
  },
  image: {
    width: wp(80),
    height: hp(30),
    resizeMode: 'cover',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: wp(5),
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: hp(3),
    marginHorizontal: wp(4),
  },
  head:{
    fontSize: wp(4),
    textAlign: 'justify',
    fontWeight: 'bold',
    marginTop: hp(3),
    marginHorizontal: wp(4),
  },
  bulletText: {
    fontSize: wp(3.5),
    textAlign: 'justify',
    fontWeight: 'normal',
    marginTop: hp(3),
    marginHorizontal: wp(4),
  },
  image:{
    width: wp(80),
    height: hp(30),
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: hp(1.5),
    marginBottom: hp(1.5),
    marginHorizontal: wp(9.9),
  },
  gobackButton: {
    backgroundColor: '#3D550C',
    color: 'white',
    textAlign: 'center',
    padding: hp(1),
    borderRadius: 10,
    marginTop: hp(4),
    width:wp(95),
    marginHorizontal:wp(2.5),
  }
})

export default Oquee