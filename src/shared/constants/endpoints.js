import { Platform } from 'react-native';

const authUrl = process.env.EXPO_PUBLIC_AUTH_URL || "http://localhost:3007/api/v1/auth";
const userUrl = process.env.EXPO_PUBLIC_USER_URL || "http://localhost:3003/restauranteUser/v1";

export const ENDPOINTS = {
    AUTH: Platform.OS === 'web' ? authUrl.replace('10.0.2.2', 'localhost') : authUrl,
    USER: Platform.OS === 'web' ? userUrl.replace('10.0.2.2', 'localhost') : userUrl
};