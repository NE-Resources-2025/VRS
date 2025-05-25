import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { getVehicles } from '../services/api';
import VehicleCard from '../components/VehicleCard';

const VehicleListingScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVehicles = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await getVehicles('available');
      setVehicles(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVehicles();
  };

  const handleVehiclePress = (vehicle) => {
    navigation.navigate('vehicle-detail', { id: vehicle.id });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading vehicles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Vehicles</Text>
        <Text style={styles.headerSubtitle}>Choose your ride</Text>
      </View>
      <FlatList
        data={vehicles}
        renderItem={({ item }) => <VehicleCard vehicle={item} onPress={() => handleVehiclePress(item)} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No vehicles available</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: SIZES.xl },
  header: { paddingHorizontal: SIZES.lg, marginBottom: SIZES.lg },
  headerTitle: { fontSize: 24, fontFamily: FONTS.bold, color: COLORS.text },
  headerSubtitle: { fontSize: 14, fontFamily: FONTS.regular, color: COLORS.textLight },
  listContainer: { paddingHorizontal: SIZES.lg, paddingBottom: SIZES.lg },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: SIZES.md, fontFamily: FONTS.medium, color: COLORS.textLight },
  emptyText: { fontFamily: FONTS.regular, fontSize: 16, color: COLORS.textLight, textAlign: 'center', marginTop: SIZES.lg },
});

export default VehicleListingScreen;