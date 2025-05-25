import axios from 'axios';
import { API_URL } from '../constants/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 5000,
});

export const loginUser = async (email, password) => {
    try {
        console.log('Login request:', { email, password, url: `${API_URL}/users?email=${email}&password=${password}` });
        const response = await api.get(`/users?email=${email}&password=${password}`);
        console.log('Login response:', response.data);
        if (response.data.length === 0) {
            throw new Error('Invalid email or password');
        }
        return response.data[0];
    } catch (error) {
        console.error('Login error:', error.message, error.response?.data);
        throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials or network.');
    }
};

export const registerUser = async (name, email, password) => {
    try {
        const existingUser = await api.get(`/users?email=${email}`);
        if (existingUser.data.length > 0) {
            throw new Error('Email already exists');
        }
        const response = await api.post('/users', { name, email, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

export const getVehicles = async (status = 'available') => {
    try {
        const response = await api.get(`/vehicles?status=${status}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch vehicles');
    }
};

export const getVehicleById = async (id) => {
    try {
        const response = await api.get(`/vehicles/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch vehicle details');
    }
};

export const getUserBookings = async (userId) => {
    try {
        console.log('Fetching bookings for user:', userId);
        const bookingsResponse = await api.get(`/bookings?userId=${userId}`);
        console.log('Bookings response:', bookingsResponse.data);
        const bookings = await Promise.all(
            bookingsResponse.data.map(async (booking) => {
                const vehicle = await getVehicleById(booking.vehicleId);
                return { ...booking, vehicle };
            })
        );
        return bookings;
    } catch (error) {
        console.error('Get bookings error:', error.message, error.response?.data);
        throw new Error('Failed to fetch bookings');
    }
};

export const createBooking = async (bookingData) => {
    try {
        console.log('Creating booking:', bookingData);
        const response = await api.post('/bookings', bookingData);
        console.log('Booking created:', response.data);
        if (!response.data.id) {
            throw new Error('Booking ID not returned');
        }
        return response.data;
    } catch (error) {
        console.error('Create booking error:', error.message, error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
};

export const updateBookingStatus = async (bookingId, status) => {
    try {
        console.log('Updating booking status:', { bookingId, status, url: `${API_URL}/bookings/${bookingId}` });
        const response = await api.patch(`/bookings/${bookingId}`, { status });
        console.log('Booking status updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Update booking status error:', error.message, error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to update booking status');
    }
};

export const updateBooking = async (bookingId, bookingData) => {
    try {
        console.log('Updating booking:', { bookingId, bookingData, url: `${API_URL}/bookings/${bookingId}` });
        const response = await api.patch(`/bookings/${bookingId}`, bookingData);
        console.log('Booking updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Update booking error:', error.message, error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to update booking');
    }
};

export const getUserById = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch user details');
    }
};

export const updateUser = async (userId, userData) => {
    try {
        console.log('Updating user:', { userId, userData, url: `${API_URL}/users/${userId}` });
        const response = await api.patch(`/users/${userId}`, userData);
        console.log('User updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Update user error:', error.message, error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to update user');
    }
};