import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { Plus, Minus, Calendar, Clock, MapPin, Car } from 'lucide-react-native';
import { updateBooking } from '../services/api';

const BookingCard = ({ booking, onCancel, onRefresh, onPress }) => {
  const [editingHours, setEditingHours] = useState(false);
  const [hoursAdjustment, setHoursAdjustment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAdjustHours = async (operation) => {
    if (!hoursAdjustment || isNaN(hoursAdjustment)) {
      Alert.alert('Invalid Input', 'Please enter a valid number of hours');
      return;
    }

    const adjustment = parseInt(hoursAdjustment);
    if (adjustment <= 0) {
      Alert.alert('Invalid Hours', 'Please enter a positive number');
      return;
    }

    let newDuration = booking.duration;
    if (operation === 'add') {
      newDuration += adjustment;
    } else if (operation === 'subtract') {
      newDuration = Math.max(1, booking.duration - adjustment); // Minimum 1 hour
    }

    setIsUpdating(true);
    try {
      const response = await updateBooking(booking.id, {
        duration: newDuration,
        totalPrice: newDuration * booking.vehicle.pricePerHour
      });
      Alert.alert('Success', `Duration updated to ${newDuration} hours`);
      onRefresh();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsUpdating(false);
      setEditingHours(false);
      setHoursAdjustment('');
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Status Ribbon */}
      <View style={[
        styles.statusRibbon,
        { backgroundColor: booking.status === 'pending' ? COLORS.pending : COLORS.confirmed }
      ]}>
        <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
      </View>

      {/* Content Area */}
      <View style={styles.content}>
        {/* Vehicle and Price */}
        <View style={styles.row}>
          <Car size={20} color={COLORS.primary} />
          <Text style={styles.vehicleText}>{booking.vehicle.type}</Text>
          <Text style={styles.priceText}>${booking.totalPrice}</Text>
        </View>

        {/* Date/Time */}
        <View style={[styles.row, styles.detailRow]}>
          <Calendar size={16} color={COLORS.textLight} />
          <Text style={styles.detailText}>
            {booking.pickupDate} • {booking.pickupTime}
          </Text>
        </View>

        {/* Duration Controls - Only for pending */}
        {booking.status === 'pending' && (
          <View style={styles.durationControls}>
            <Text style={styles.durationLabel}>Duration: {booking.duration} hrs</Text>
            
            {editingHours ? (
              <View style={styles.hourEditContainer}>
                <TextInput
                  style={styles.hourInput}
                  placeholder="Hours"
                  value={hoursAdjustment}
                  onChangeText={setHoursAdjustment}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <TouchableOpacity
                  style={[styles.hourButton, styles.addButton]}
                  onPress={() => handleAdjustHours('add')}
                  disabled={isUpdating}
                >
                  <Plus size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.hourButton, styles.subtractButton]}
                  onPress={() => handleAdjustHours('subtract')}
                  disabled={isUpdating}
                >
                  <Minus size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.editHoursButton}
                onPress={() => setEditingHours(true)}
              >
                <Text style={styles.editHoursText}>Edit Hours</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Locations */}
        <View style={[styles.row, styles.detailRow]}>
          <MapPin size={16} color={COLORS.textLight} />
          <Text style={styles.detailText}>{booking.pickupLocation}</Text>
        </View>
        <View style={[styles.row, styles.detailRow]}>
          <MapPin size={16} color={COLORS.textLight} />
          <Text style={styles.detailText}>{booking.dropLocation}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {booking.status === 'pending' && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => onCancel(booking)}
            disabled={isUpdating}
          >
            <Text style={styles.buttonText}>
              {isUpdating ? 'Processing...' : 'Cancel Booking'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.md,
    marginBottom: SIZES.lg,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  statusRibbon: {
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.sm,
    alignSelf: 'flex-start',
    borderBottomRightRadius: SIZES.sm,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  content: {
    padding: SIZES.md,
    paddingTop: SIZES.md + 4, // Extra space for status ribbon
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleText: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginLeft: SIZES.sm,
  },
  priceText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  detailRow: {
    marginTop: SIZES.sm,
  },
  detailText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginLeft: SIZES.sm,
    flex: 1,
  },
  actionContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SIZES.sm,
  },
  cancelButton: {
    backgroundColor: COLORS.error,
    borderRadius: SIZES.sm,
    padding: SIZES.sm,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  durationControls: {
    marginTop: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  durationLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  hourEditContainer: {
    flexDirection: 'row',
    marginTop: SIZES.xs,
    alignItems: 'center',
  },
  hourInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.sm,
    paddingHorizontal: SIZES.sm,
    marginRight: SIZES.sm,
    fontFamily: FONTS.regular,
  },
  hourButton: {
    width: 40,
    height: 40,
    borderRadius: SIZES.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.xs,
  },
  addButton: {
    backgroundColor: COLORS.confirmed,
  },
  subtractButton: {
    backgroundColor: COLORS.error,
  },
  editHoursButton: {
    alignSelf: 'flex-start',
    marginTop: SIZES.xs,
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.sm,
    backgroundColor: COLORS.primary + '20',
    borderRadius: SIZES.sm,
  },
  editHoursText: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
});

export default BookingCard;