import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { getVehicleById, createBooking } from '../services/api';
import { ChevronLeft, MapPin, Calendar, Clock, Check, Car } from 'lucide-react-native';

const BookingFormScreen = ({ navigation, route }) => {
  const id = route.params?.id;
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    pickupLocation: '',
    dropLocation: '',
    pickupDate: '2025-05-25',
    pickupTime: '09:00',
    duration: '1',
  });

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchVehicle = async () => {
      try {
        const data = await getVehicleById(id);
        setVehicle(data);
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleInputChange = (field, value) => {
    setBookingForm({ ...bookingForm, [field]: value });
  };

  const handleSubmit = async () => {
    if (!bookingForm.pickupLocation || !bookingForm.dropLocation) {
      Alert.alert('Error', 'Please enter pickup and drop-off locations');
      return;
    }

    if (!bookingForm.pickupDate || !bookingForm.pickupTime) {
      Alert.alert('Error', 'Please select date and time');
      return;
    }

    const duration = parseInt(bookingForm.duration) || 1;
    if (duration < 1) {
      Alert.alert('Error', 'Duration must be at least 1 hour');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (!vehicle) {
      Alert.alert('Error', 'Vehicle information not available');
      return;
    }

    setIsSubmitting(true);
    try {
      const booking = {
        userId: user.id,
        vehicleId: vehicle.id,
        status: 'pending',
        pickupLocation: bookingForm.pickupLocation,
        dropLocation: bookingForm.dropLocation,
        pickupDate: bookingForm.pickupDate,
        pickupTime: bookingForm.pickupTime,
        duration: duration,
        totalPrice: duration * vehicle.pricePerHour,
      };

      const response = await createBooking(booking);
      Alert.alert('Success', 'Booking created successfully');
      navigation.navigate('payment', { bookingId: response.id });
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading vehicle details...</Text>
      </View>
    );
  }

  if (!vehicle || !id) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Vehicle not found</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={20} color={COLORS.primary} />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Book Your Ride</Text>
        </View>

        <View style={styles.vehicleCard}>
          <View style={styles.vehicleIcon}>
            <Car size={32} color={COLORS.primary} />
          </View>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleType}>{vehicle.type}</Text>
            <Text style={styles.vehicleRate}>${vehicle.pricePerHour}/hour</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Trip Details</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Pickup Location</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter pickup address"
                value={bookingForm.pickupLocation}
                onChangeText={(value) => handleInputChange('pickupLocation', value)}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Drop-off Location</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter drop-off address"
                value={bookingForm.dropLocation}
                onChangeText={(value) => handleInputChange('dropLocation', value)}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Pickup Date</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={bookingForm.pickupDate}
                  onChangeText={(value) => handleInputChange('pickupDate', value)}
                />
              </View>
            </View>

            <View style={[styles.inputWrapper, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Pickup Time</Text>
              <View style={styles.inputContainer}>
                <Clock size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM"
                  value={bookingForm.pickupTime}
                  onChangeText={(value) => handleInputChange('pickupTime', value)}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Duration (hours)</Text>
            <View style={styles.inputContainer}>
              <Clock size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="How many hours?"
                value={bookingForm.duration}
                onChangeText={(value) => handleInputChange('duration', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalPrice}>
              ${vehicle.pricePerHour * (parseInt(bookingForm.duration) || 0)}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit} 
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Check size={20} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.buttonText}>Confirm Booking</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SIZES.lg,
    marginBottom: SIZES.xl,
    ...SHADOWS.small,
  },
  vehicleIcon: {
    backgroundColor: 'rgba(0, 128, 128, 0.1)',
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleType: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  vehicleRate: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  formContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SIZES.lg,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.lg,
  },
  inputWrapper: {
    marginBottom: SIZES.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.md,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputIcon: {
    marginRight: SIZES.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.md,
    marginBottom: SIZES.xl,
    paddingVertical: SIZES.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  totalPrice: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: SIZES.md, 
    fontFamily: FONTS.medium, 
    color: COLORS.textLight 
  },
  errorContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  errorText: { 
    fontSize: 18, 
    fontFamily: FONTS.medium, 
    color: COLORS.error, 
    marginBottom: SIZES.md 
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginLeft: 4,
  },
});

export default BookingFormScreen;