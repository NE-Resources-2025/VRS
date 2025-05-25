import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { updateUser, getUserById } from '../services/api';
import { User, Mail, Lock, LogOut, Save } from 'lucide-react-native';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: '' 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await getUserById(user.id);
        setProfile({ 
          name: data.name, 
          email: data.email, 
          password: '',
          confirmPassword: '' 
        });
      } catch (error) {
        setErrors({ general: error.message });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
    // Clear field-specific error when typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profile.name.trim()) newErrors.name = 'Name is required';
    if (!profile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (profile.password && profile.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (profile.password !== profile.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const updateData = { 
        name: profile.name, 
        email: profile.email 
      };
      
      // Only include password if it was changed
      if (profile.password) {
        updateData.password = profile.password;
      }

      await updateUser(user.id, updateData);
      Alert.alert('Success', 'Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      setErrors({ general: error.message || 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', onPress: () => {
          logout();
          navigation.replace('login');
        }}
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
          {!editMode && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setEditMode(true)}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {errors.general && (
          <Text style={styles.errorText}>{errors.general}</Text>
        )}

        <View style={styles.formContainer}>
          {/* Name Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={[
              styles.inputContainer,
              errors.name && styles.inputError
            ]}>
              <User size={20} color={COLORS.textLight} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Your name"
                value={profile.name}
                onChangeText={(value) => handleInputChange('name', value)}
                editable={editMode}
              />
            </View>
            {errors.name && <Text style={styles.fieldError}>{errors.name}</Text>}
          </View>

          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[
              styles.inputContainer,
              errors.email && styles.inputError
            ]}>
              <Mail size={20} color={COLORS.textLight} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                value={profile.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={editMode}
              />
            </View>
            {errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
          </View>

          {/* Only show password fields in edit mode */}
          {editMode && (
            <>
              {/* New Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <View style={[
                  styles.inputContainer,
                  errors.password && styles.inputError
                ]}>
                  <Lock size={20} color={COLORS.textLight} style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Leave blank to keep current"
                    value={profile.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry
                  />
                </View>
                {errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}
              </View>

              {/* Confirm Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={[
                  styles.inputContainer,
                  errors.confirmPassword && styles.inputError
                ]}>
                  <Lock size={20} color={COLORS.textLight} style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    value={profile.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry
                  />
                </View>
                {errors.confirmPassword && (
                  <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
                )}
              </View>
            </>
          )}

          {/* Action Buttons */}
          {editMode ? (
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={handleUpdate}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Save size={20} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Save</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setEditMode(false);
                  setErrors({});
                }}
                disabled={isSubmitting}
              >
                <Text style={[styles.buttonText, { color: COLORS.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.button, styles.logoutButton]}
              onPress={handleLogout}
            >
              <LogOut size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: SIZES.xl,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SIZES.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  editButton: {
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.sm,
    borderRadius: SIZES.sm,
    backgroundColor: COLORS.primary + '20',
  },
  editButtonText: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.md,
    padding: SIZES.lg,
    ...SHADOWS.small,
  },
  inputGroup: {
    marginBottom: SIZES.lg,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.sm,
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.md,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  icon: {
    marginRight: SIZES.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  fieldError: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    marginBottom: SIZES.lg,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.md,
  },
  button: {
    flex: 1,
    borderRadius: SIZES.sm,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    marginRight: SIZES.sm,
  },
  cancelButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginLeft: SIZES.sm,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    marginTop: SIZES.md,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  buttonIcon: {
    marginRight: SIZES.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.md,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
  },
});

export default ProfileScreen;