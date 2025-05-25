import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser, getUserById } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const userData = await getUserById(userId);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const userData = await loginUser(email, password);
      await AsyncStorage.setItem('userId', userData.id.toString());
      setUser(userData);
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const userData = await registerUser(name, email, password);
      await AsyncStorage.setItem('userId', userData.id.toString());
      setUser(userData);
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
