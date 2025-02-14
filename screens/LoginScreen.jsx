import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Platform, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';  
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;

      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userType = docSnap.data().userType;

        let destinationScreen = '';

        if (userType === 'Voluntário') {
          destinationScreen = 'Volunteer';
        } else if (userType === 'Empresa') {
          destinationScreen = 'Company';
        } else if (userType === 'Administrador') {
          destinationScreen = 'Admin';
        } else {
          console.error('Tipo de usuário desconhecido!');
          return;
        }

        navigation.reset({
          index: 0,
          routes: [{ name: destinationScreen }],
        });
      } else {
        console.log("Nenhum documento encontrado!");
      }
    } catch (error) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, username);
      setSuccessMessage("E-mail de recuperação enviado. Verifique sua caixa de entrada.");
      setError('');
    } catch (error) {
      setError("Erro ao enviar e-mail de recuperação. Verifique o e-mail digitado.");
    }
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setSuccessMessage('');
    setError('');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={require('../assets/Login - Copy.png')} style={style.imageBack}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 50}
        >
          <ScrollView>
            <View style={[style.cardContainerRegisto, { backgroundColor: 'rgba(255, 255, 255, 0.7)' }]}>
              <Text style={style.headText2}>Ainda não possui conta?</Text>
              <TouchableOpacity style={style.buttonRegistar} onPress={() => navigation.navigate('Register')}>
                <Text style={style.buttonRegText}>Registar</Text>
              </TouchableOpacity>
            </View>

            <View style={[style.cardContainer, { backgroundColor: 'rgba(255, 255, 255, 0.7)' }]}>
              <Text style={style.headText}>{isForgotPassword ? 'Recuperação de Senha' : 'Login'}</Text>

              <Text style={style.titleText}>Email</Text>
              <TextInput
                placeholder="Email"
                value={username}
                onChangeText={text => setUsername(text)}
                style={style.textInput}
                inputMode='email'
              />

              {isForgotPassword ? (
                <>
                  <TouchableOpacity onPress={handleBackToLogin}>
                    <Text style={style.forgotText}>Voltar ao Login</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleForgotPassword} style={style.buttonEntrar}>
                    <Text style={style.buttonText}>Confirmar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={style.titleText}>Senha</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TextInput
                      placeholder="Senha"
                      secureTextEntry={!isPasswordVisible}
                      value={password}
                      onChangeText={text => setPassword(text)}
                      style={[style.textInput, { flex: 0 }]} // Flexível para ocupar o espaço disponível
                    />
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={{paddingRight:hp(1),marginVertical:hp(1) }}>
                      <Text style={style.passwordToggleText}>{isPasswordVisible ? 'Ocultar' : 'Mostrar'}</Text>
                    </TouchableOpacity>
                  </View>

                  {error !== '' && <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>}

                  <TouchableOpacity onPress={() => setIsForgotPassword(true)}>
                    <Text style={style.forgotText}>Esqueceu-se da sua senha?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleLogin} style={style.buttonEntrar}>
                    <Text style={style.buttonText}>Entrar</Text>
                  </TouchableOpacity>
                </>
              )}

              {successMessage !== '' && <Text style={{ color: 'green', textAlign: 'center' }}>{successMessage}</Text>}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const style = StyleSheet.create({
  imageBack: {
    flex: 1,
    resizeMode: 'cover',
  },
  cardContainer: {
    width: wp(90),
    height: hp(50),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    marginVertical: hp(12),
    justifyContent: 'center',
    elevation: 5,
    marginHorizontal: wp(5),
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    width: wp(80),
    height: hp(6),
    marginVertical: hp(2),
    marginHorizontal: wp(5),
    paddingLeft: wp(7),
  },
  buttonEntrar: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    width: wp(35),
    height: hp(5),
    marginVertical: hp(5),
    marginHorizontal: wp(27),
    backgroundColor: '#95c144'
  },
  buttonText: {
    textAlign: 'center',
    fontSize: RFPercentage(2.5),
    fontWeight: 'normal',
    color: '#000000',
    paddingTop: hp(1),
    marginTop: Platform.OS === 'ios' ? hp(0) : hp(-0.5)
  },
  headText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: RFPercentage(3),
    marginVertical: hp(3),
  },
  titleText: {
    marginHorizontal: wp(6),
    fontSize: RFPercentage(2),
  },
  forgotText: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: RFPercentage(2),
  },
  cardContainerRegisto: {
    width: wp(90),
    height: hp(10),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    marginTop: hp(10),
    justifyContent: 'center',
    elevation: 5,
    marginHorizontal: wp(5),
  },
  headText2: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: RFPercentage(2),
    marginBottom: hp(2),
  },
  buttonRegistar: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    width: wp(35),
    height: Platform.OS === 'ios' ? hp(3) : hp(4),
    marginHorizontal: wp(27),
    backgroundColor: '#B6B6AD',
  },
  buttonRegText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'normal',
    marginTop: Platform.OS === 'ios' ? hp(0.5) : hp(0.4),
  },
  passwordToggleText: {
    fontSize: RFPercentage(2),
    marginLeft: Platform.OS === 'ios' ? wp(-25) : wp(-20),
    marginTop: hp(2.5),
  },
});
