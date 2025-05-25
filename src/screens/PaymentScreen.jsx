import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { updateBookingStatus } from '../services/api';
import { CreditCard, Calendar, Lock } from 'lucide-react-native';

const PaymentScreen = ({ navigation, route }) => {
  const bookingId = route.params?.bookingId;
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '1234567890123456',
    expiry: '12/26',
    cvv: '123',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setCardDetails({ ...cardDetails, [field]: value });
    setError('');
  };

  const handleSubmit = async () => {
    if (!bookingId) {
      setError('Invalid booking ID. Please try booking again.');
      return;
    }
    if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv) {
      setError('Please fill in all fields');
      return;
    }
    if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      setError('CVV must be 3 or 4 digits');
      return;
    }
    if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ''))) {
      setError('Card number must be 16 digits');
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) {
      setError('Expiry must be in MM/YY format');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Updating booking status:', { bookingId, status: 'confirmed' });
      await updateBookingStatus(bookingId, 'confirmed');
      alert('Payment successful! Booking confirmed.');
      navigation.navigate('main', { screen: 'home' });
    } catch (error) {
      console.error('Payment error:', error.message, error.response?.data);
      setError(error.message || 'Failed to process payment. Please check your network or try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Payment Details</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.inputContainer}>
          <CreditCard size={20} color={COLORS.textLight} style={styles.inputIcon} />
          <TextInput
  style={styles.input}
  placeholder="Card Number"
  value={cardDetails.cardNumber.replace(/(\d{4})/g, '$1 ').trim()} // Format as "1234 5678 9012 3456"
  onChangeText={(value) => handleInputChange('cardNumber', value.replace(/\s/g, ''))}
  keyboardType="numeric"
  maxLength={19}
/>
        </View>
        <View style={styles.inputRow}>
          <View style={[styles.inputContainer, styles.inputHalf]}>
            <Calendar size={20} color={COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              value={cardDetails.expiry}
              onChangeText={(value) => handleInputChange('expiry', value)}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
          <View style={[styles.inputContainer, styles.inputHalf]}>
            <Lock size={20} color={COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              value={cardDetails.cvv}
              onChangeText={(value) => handleInputChange('cvv', value)}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Confirm Payment</Text>
          )}
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
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.sm, marginBottom: SIZES.md, backgroundColor: COLORS.background },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.md },
  inputHalf: { flex: 1, marginRight: SIZES.sm },
  inputIcon: { marginHorizontal: SIZES.sm },
  input: { flex: 1, height: 50, fontFamily: FONTS.regular, color: COLORS.text },
  button: { backgroundColor: COLORS.primary, borderRadius: SIZES.sm, height: 50, justifyContent: 'center', alignItems: 'center', marginVertical: SIZES.md, ...SHADOWS.small },
  buttonText: { color: '#fff', fontSize: 16, fontFamily: FONTS.medium },
});

export default PaymentScreen;