import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Car, Star, Users, MapPin } from 'lucide-react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const VehicleCard = ({ vehicle, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Vehicle Image with Status Badge */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: vehicle.image }} 
          style={styles.vehicleImage}
          resizeMode="cover"
        />
        <View style={[
          styles.statusBadge,
          vehicle.status === 'available' ? styles.availableBadge : styles.unavailableBadge
        ]}>
          <Text style={styles.statusText}>
            {vehicle.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Vehicle Info */}
      <View style={styles.infoContainer}>
        {/* Title Row */}
        <View style={styles.titleRow}>
          <Text style={styles.vehicleModel}>{vehicle.type}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>{vehicle.rating || '4.8'}</Text>
          </View>
        </View>

        {/* License Plate */}
        <Text style={styles.plateText}>{vehicle.plate}</Text>

        {/* Features Row */}
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <Users size={16} color={COLORS.textLight} />
            <Text style={styles.featureText}>{vehicle.seats || 4} seats</Text>
          </View>
          <View style={styles.featureItem}>
            <Car size={16} color={COLORS.textLight} />
            <Text style={styles.featureText}>{vehicle.transmission || 'Automatic'}</Text>
          </View>
        </View>

        {/* Driver Info */}
        <View style={styles.driverRow}>
          <MapPin size={16} color={COLORS.primary} />
          <Text style={styles.driverText}>Driver: {vehicle.driver}</Text>
        </View>

        {/* Price and Action */}
        <View style={styles.footer}>
          <Text style={styles.priceText}>${vehicle.pricePerHour}/hour</Text>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={onPress}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  imageContainer: {
    height: 160,
    position: 'relative',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: COLORS.available,
  },
  unavailableBadge: {
    backgroundColor: COLORS.unavailable,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  infoContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  vehicleModel: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginLeft: 4,
  },
  plateText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  featuresRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginLeft: 6,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  driverText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});

export default VehicleCard;