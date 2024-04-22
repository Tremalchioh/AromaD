import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrlFavorites, apiUrlLogin, apiUrlRatePerfume, apiUrlRecentlyViewed, apiUrlRegister} from "../consts";

const useAuthStore = create((set) => ({
    user: null,
    userId: null,
    token: null,
    favoritePerfumes: [],
    recentlyViewedPerfumes: [],

    login: async (username, password) => {
        try {
            const response = await fetch(apiUrlLogin, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"username": username, "password": password})
            })
            if (response.ok) {
                const { token, userId } = await response.json();
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('user', username);
                await AsyncStorage.setItem('userId', userId.toString());
                set({ user: {username}, userId, token });
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Ошибка при запросе на сервер для входа:', error);
            return false;
        }
    },
    logout: async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('userId');
        set({ userId: null, user: null, token: null });
    },
    checkAuthentication: async () => {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');
        const userId = parseInt(await AsyncStorage.getItem('userId'), 10);
        if (token) {
            // Проверка валидности токена и получение данных пользователя с сервера
            set({ user, token, userId });
            return true;
        } else {
            return false;
        }
    },
    register: async (username, password) => {
        // Реализация запроса на сервер для регистрации
        try {
            const response = await fetch(apiUrlRegister, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Ошибка при запросе на сервер для регистрации:', error);
            return false;
        }
    },
    fetchFavorites: async(userId) => {
        try {
            const response = await fetch(apiUrlFavorites, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"userId": userId})
            })
            const favoritePerfumes = await response.json();
            if (!favoritePerfumes) {
                throw new Error('Failed to fetch perfumes');
            }
            set(state => ({
                ...state,
                favoritePerfumes,
            }))
            console.log("successfully fetched favorite perfumes");
        } catch (error) {
            console.error('Error fetching favorite perfumes:', error);
        }
    },
    fetchRecentlyViewed: async(userId) => {
        try {
            const response = await fetch(apiUrlRecentlyViewed, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"userId": userId})
            })
            const recentlyViewedPerfumes = await response.json()
            if (!recentlyViewedPerfumes) {
                throw new Error('Failed to fetch recently viewed perfumes (client side)');
            }
            set(state => ({
                ...state,
                recentlyViewedPerfumes,
            }))
            console.log("successfully fetched recently viewed perfumes");
        } catch (error) {
            console.error('Error fetching recently viewed perfumes (client side):', error);
        }
    },
    ratePerfume: async(userId, rating, perfumeId) => {
        try {
            const response = await fetch(apiUrlRatePerfume, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ userId, rating, perfumeId }),
            });
            if (response.ok) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Ошибка при запросе на сервер для оценки парфюма:', error);
            return false;
        }
    }
}));

export default useAuthStore;