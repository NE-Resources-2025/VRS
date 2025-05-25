import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react-native';

const LoginScreen = ({ navigation }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('jane@example.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const success = await login(email, password);
      if (success) {
        navigation.replace('main', { screen: 'home' });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your network or credentials.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.inputContainer}>
          <Mail size={20} color={COLORS.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Lock size={20} color={COLORS.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity 
  style={[styles.button, { 
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }]} 
  onPress={handleLogin}
>
  <Mail size={20} color="#FFF" style={{ marginRight: 8 }} />
  <Text style={styles.buttonText}>Sign In</Text>
</TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('register')}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', padding: SIZES.lg },
  formContainer: { backgroundColor: COLORS.card, borderRadius: SIZES.md, padding: SIZES.lg, ...SHADOWS.small },
  title: { fontSize: 24, fontFamily: FONTS.bold, color: COLORS.text, marginBottom: SIZES.lg, textAlign: 'center' },
  errorText: { fontSize: 14, fontFamily: FONTS.regular, color: COLORS.error, marginBottom: SIZES.md, textAlign: 'center' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.sm,
    marginBottom: SIZES.md,
    backgroundColor: COLORS.card,
  },
  inputIcon: { marginHorizontal: SIZES.sm },
  input: { flex: 1, height: 50, fontFamily: FONTS.regular, color: COLORS.text },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.sm,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SIZES.md,
    flexDirection: 'row',
    ...SHADOWS.small,
  },
  buttonText: { color: '#fff', fontSize: 16, fontFamily: FONTS.medium },
  linkText: { fontSize: 14, fontFamily: FONTS.regular, color: COLORS.primary, textAlign: 'center' },
});

export default LoginScreen;