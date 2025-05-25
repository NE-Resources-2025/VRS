import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { getUserBookings, updateBookingStatus } from '../services/api';
import BookingCard from '../components/BookingCard';
import { Calendar, Clock, Car, MapPin } from 'lucide-react-native';

const MyBookingsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'upcoming', 'past', 'cancelled'

  const fetchBookings = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await getUserBookings(user.id);
      setBookings(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleCancelBooking = (booking) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await updateBookingStatus(booking.id, 'cancelled');
              fetchBookings();
              Alert.alert('Success', 'Booking cancelled successfully');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const filteredBookings = bookings.filter(booking => {
    const now = new Date();
    const bookingDate = new Date(`${booking.pickupDate}T${booking.pickupTime}`);
    
    switch (activeTab) {
      case 'upcoming':
        return booking.status !== 'cancelled' && bookingDate > now;
      case 'past':
        return booking.status !== 'cancelled' && bookingDate <= now;
      case 'cancelled':
        return booking.status === 'cancelled';
      default:
        return true;
    }
  });

  const renderBookingItem = ({ item }) => (
    <BookingCard
      booking={item}
      onCancel={handleCancelBooking}
      onRefresh={fetchBookings}
      onPress={() => navigation.navigate('BookingDetails', { bookingId: item.id })}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>View and manage your rentals</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>Past</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>Cancelled</Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingBottom: SIZES.xl,
          paddingTop: SIZES.sm // Added top padding
        }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[COLORS.primary]} 
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Car size={48} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No {activeTab} bookings found</Text>
            <Text style={styles.emptySubtext}>When you make bookings, they'll appear here</Text>
          </View>
        }
      />
    </View>
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
    marginBottom: SIZES.lg 
  },
  headerTitle: { 
    fontSize: 24, 
    fontFamily: FONTS.bold, 
    color: COLORS.text 
  },
  headerSubtitle: { 
    fontSize: 14, 
    fontFamily: FONTS.regular, 
    color: COLORS.textLight, 
    marginTop: 4 
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.lg,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.sm,
    padding: SIZES.xs,
    ...SHADOWS.small,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.sm,
    alignItems: 'center',
    borderRadius: SIZES.xs,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
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
  listContainer: { 
    paddingBottom: SIZES.xl 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  emptyText: { 
    fontSize: 16, 
    fontFamily: FONTS.medium, 
    color: COLORS.text, 
    marginTop: SIZES.md,
    marginBottom: SIZES.xs,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default MyBookingsScreen;