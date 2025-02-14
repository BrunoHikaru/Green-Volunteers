import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

export default function AuthForm({ onSubmit, buttonText }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Voluntário');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    setError('');
    onSubmit(email, password, userType);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {buttonText === 'Registrar' && (
        <TextInput
          style={styles.input}
          placeholder="Tipo de Usuário (Empresa, Voluntário, Administrador)"
          value={userType}
          onChangeText={setUserType}
          autoCapitalize="none"
        />
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={buttonText} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
