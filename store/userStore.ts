import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { UserData, INITIAL_USER_DATA } from '../data/userMockData';
import { apiClient } from '../api/apiClient';
import { validateEmail, validatePassword } from '../utils/security';

interface UserState {
  user: UserData;
  registeredUsers: UserData[];
  isAuthenticated: boolean;
  register: (data: Partial<UserData>) => Promise<void>;
  completeRegistration: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleFavorite: (eventId: string) => Promise<void>;
  isFavorite: (eventId: string) => boolean;
  isPurchased: (eventId: string) => boolean;
  buyTicket: (eventId: string, quantity: number) => Promise<void>;
  updateInterests: (interests: string[]) => Promise<void>;
  updateProfile: (data: Partial<UserData>) => Promise<void>;
  becomeOrganizer: () => Promise<void>;
  toggleFollow: (organizerId: string) => Promise<void>;
  isFollowing: (organizerId: string) => boolean;
  fetchMyTickets: () => Promise<void>;
  uploadAvatar: (uri: string) => Promise<string>;
  clearAllData: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: INITIAL_USER_DATA,
      registeredUsers: [],
      isAuthenticated: false,

      register: async data => {
        if (!data.email || !validateEmail(data.email))
          throw new Error('Некорректный формат email');
        if (!data.password) throw new Error('Пароль обязателен');
        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.valid)
          throw new Error(passwordValidation.message || 'Некорректный пароль');

        try {
          const result = await apiClient('register', {
            method: 'POST',
            body: JSON.stringify(data),
          });

          // Сохраняем реальный токен от сервера
          let tokenSaved = false;
          const possibleTokenKeys = [
            'token',
            'accessToken',
            'authToken',
            'access_token',
            'jwt',
          ];

          for (const key of possibleTokenKeys) {
            if (result[key]) {
              await AsyncStorage.setItem('user-token', result[key]);
              tokenSaved = true;
              break;
            }
          }

          if (!tokenSaved) {
            throw new Error('Ошибка авторизации после регистрации');
          }

          const newUser = {
            ...INITIAL_USER_DATA,
            ...data,
            id: result.userId || result.user?.id || 'user-' + Date.now(),
            ...result.user,
          };

          set(state => ({
            user: newUser,
            registeredUsers: [...state.registeredUsers, newUser],
          }));
        } catch (error) {
          throw error;
        }
      },

      completeRegistration: () => {
        const { user } = get();
        if (user && user.id) {
          set({ isAuthenticated: true });
        }
      },

      login: async (email, password) => {
        try {
          const res = await apiClient('login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });

          let tokenToSave = null;
          const possibleTokenKeys = [
            'token',
            'accessToken',
            'authToken',
            'access_token',
            'jwt',
          ];

          for (const key of possibleTokenKeys) {
            if (res[key]) {
              tokenToSave = res[key];
              break;
            }
          }

          if (tokenToSave) {
            await AsyncStorage.setItem('user-token', tokenToSave);
          } else {
            throw new Error('Token not found in login response');
          }

          const userData = res.user || {
            ...INITIAL_USER_DATA,
            id: 'user-' + Date.now(),
            email,
            name: email.split('@')[0],
          };

          set({
            user: userData,
            isAuthenticated: true,
            registeredUsers: [
              userData,
              ...get().registeredUsers.filter(u => u.id !== userData.id),
            ],
          });

          return true;
        } catch (e) {
          return false;
        }
      },

      logout: () => {
        AsyncStorage.removeItem('user-token');
        const { user, registeredUsers } = get();
        if (user.id) {
          const updatedUsers = registeredUsers.map(u => (u.id === user.id ? user : u));
          set({ registeredUsers: updatedUsers });
        }
        set({ isAuthenticated: false, user: { ...INITIAL_USER_DATA, id: '' } });
      },

      updateInterests: async interests => {
        const user = get().user;
        if (user.userType === 'organizer') return;

        try {
          const token = await AsyncStorage.getItem('user-token');
          if (!token) {
            set(state => ({ user: { ...state.user, interests } }));
            return;
          }

          set(state => ({ user: { ...state.user, interests } }));

          const res = await apiClient('user/interests', {
            method: 'POST',
            body: JSON.stringify({ interests }),
          });

          if (res.interests) {
            set(state => ({
              user: { ...state.user, interests: res.interests },
            }));
          }
        } catch (error: any) {}
      },

      updateProfile: async data => {
        try {
          const updatedUser = await apiClient('user/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
          });
          set(state => ({ user: updatedUser }));
        } catch (error) {
          throw error;
        }
      },

      becomeOrganizer: async () => {
        try {
          const updatedUser = await apiClient('user/become-organizer', {
            method: 'POST',
          });
          set(state => ({
            user: updatedUser,
            registeredUsers: state.registeredUsers.map(u =>
              u.id === updatedUser.id ? updatedUser : u
            ),
          }));
        } catch (error) {
          throw error;
        }
      },

      toggleFollow: async organizerId => {
        if (get().user.userType !== 'explorer') return;
        try {
          const res = await apiClient('user/follow', {
            method: 'POST',
            body: JSON.stringify({ organizerId }),
          });
          set(state => ({
            user: { ...state.user, followingOrganizerIds: res.followingOrganizerIds },
          }));
        } catch (error) {}
      },

      isFollowing: id => {
        return get().user.followingOrganizerIds?.includes(id) || false;
      },

      toggleFavorite: async id => {
        if (get().user.userType === 'organizer') return;
        try {
          const res = await apiClient('user/favorite', {
            method: 'POST',
            body: JSON.stringify({ eventId: id }),
          });
          set(state => ({ user: { ...state.user, savedEventIds: res.savedEventIds } }));
        } catch (error) {}
      },

      isFavorite: id => {
        return get().user.savedEventIds.includes(id);
      },

      isPurchased: id => {
        return get().user.purchasedTickets.some(t => t.eventId === id);
      },

      buyTicket: async (eventId, quantity) => {
        if (!quantity || quantity <= 0 || quantity > 10)
          throw new Error('От 1 до 10 билетов');

        try {
          await apiClient('tickets/buy', {
            method: 'POST',
            body: JSON.stringify({ eventId, quantity }),
          });
          await get().fetchMyTickets();
        } catch (error) {
          throw error;
        }
      },

      fetchMyTickets: async () => {
        try {
          const token = await AsyncStorage.getItem('user-token');
          if (!token) return;

          const tickets = await apiClient('tickets/my', { method: 'GET' });

          set(state => ({
            user: {
              ...state.user,
              purchasedTickets: tickets,
              hasTickets: tickets.length > 0,
            },
          }));
        } catch (e: any) {}
      },

      uploadAvatar: async (uri: string) => {
        const formData = new FormData();

        // Для React Native формирование FormData для файлов выглядит так:
        const filename = uri.split('/').pop() || 'avatar.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('avatar', {
          uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
          name: filename,
          type,
        } as any);

        try {
          const res = await apiClient('user/upload-avatar', {
            method: 'POST',
            body: formData,
          });

          if (res.avatarUrl) {
            set(state => ({
              user: { ...state.user, avatarUrl: res.avatarUrl },
            }));
            return res.avatarUrl;
          }
          throw new Error('Ошибка загрузки');
        } catch (error) {
          throw error;
        }
      },

      clearAllData: async () => {
        await useUserStore.persist.clearStorage();
        await AsyncStorage.removeItem('user-token');
        set({
          user: { ...INITIAL_USER_DATA, id: '' },
          registeredUsers: [],
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'user-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        user: state.user,
        registeredUsers: state.registeredUsers,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
