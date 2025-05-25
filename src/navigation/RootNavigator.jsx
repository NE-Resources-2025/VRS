import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VehicleListingScreen from '../screens/VehicleListingScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BookingFormScreen from '../screens/BookingFormScreen';
import PaymentScreen from '../screens/PaymentScreen';
import { Home, Book, User } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for home, bookings, profile
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        if (route.name === 'home') {
          return <Home size={size} color={color} />;
        } if (route.name === 'bookings') {
          return <Book size={size} color={color} />;
        } if (route.name === 'profile') {
          return <User size={size} color={color} />;
        }
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textLight,
      tabBarStyle: { backgroundColor: COLORS.card },
      headerShown: false,
    })}
  >
    <Tab.Screen name="home" component={VehicleListingScreen} options={{ title: 'Available Vehicles' }} />
    <Tab.Screen name="bookings" component={MyBookingsScreen} options={{ title: 'My Bookings' }} />
    <Tab.Screen name="profile" component={ProfileScreen} options={{ title: 'Profile' }} />
  </Tab.Navigator>
);

const RootNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="vehicle-detail" component={BookingFormScreen} options={{ title: 'Book Vehicle' }} />
      <Stack.Screen name="payment" component={PaymentScreen} options={{ title: 'Payment' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;