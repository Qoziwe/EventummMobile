import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { UserData, INITIAL_USER_DATA, PurchasedTicket } from '../data/userMockData';

const customStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') return localStorage.getItem(name);
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') localStorage.setItem(name, value);
      else await AsyncStorage.setItem(name, value);
    } catch {}
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') localStorage.removeItem(name);
      else await AsyncStorage.removeItem(name);
    } catch {}
  },
};

interface UserState {
  user: UserData;
  registeredUsers: UserData[];
  isAuthenticated: boolean;
  register: (data: Partial<UserData>) => Promise<void>;
  completeRegistration: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleFavorite: (eventId: string) => void;
  isFavorite: (eventId: string) => boolean;
  isPurchased: (eventId: string) => boolean;
  buyTicket: (eventId: string, quantity: number) => void;
  updateInterests: (interests: string[]) => void;
  updateProfile: (data: Partial<UserData>) => void;
  becomeOrganizer: () => void;
  toggleFollow: (organizerId: string) => void;
  isFollowing: (organizerId: string) => boolean;
  clearAllData: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: INITIAL_USER_DATA,
      registeredUsers: [],
      isAuthenticated: false,

      register: async data => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const { registeredUsers } = get();

        if (data.email) {
          const isEmailTaken = registeredUsers.some(
            u => u.email.toLowerCase() === data.email?.toLowerCase()
          );
          if (isEmailTaken) throw new Error('Пользователь с такой почтой уже существует');
        }

        const initials = data.name
          ? data.name
              .trim()
              .split(/\s+/)
              .map(n => n[0])
              .join('')
              .toUpperCase()
          : '??';

        const newUser: UserData = {
          ...INITIAL_USER_DATA,
          ...data,
          id: `user_${Math.random().toString(36).substr(2, 9)}`,
          avatarInitials: initials.substring(0, 2),
          userType: data.userType || 'explorer',
          role: data.userType === 'organizer' ? 'Организатор' : 'Исследователь',
          followingOrganizerIds: [],
        };

        set(state => ({
          user: newUser,
          registeredUsers: [...state.registeredUsers, newUser],
        }));
      },

      completeRegistration: () => {
        const { user } = get();
        if (user && user.id) set({ isAuthenticated: true });
      },

      login: async (email, password) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const { registeredUsers } = get();
        const existingUser = registeredUsers.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (existingUser) {
          set({ user: existingUser });
          return true;
        }
        return false;
      },

      logout: () => {
        const { user, registeredUsers } = get();
        if (user.id) {
          const updatedUsers = registeredUsers.map(u => (u.id === user.id ? user : u));
          set({ registeredUsers: updatedUsers });
        }
        set({ isAuthenticated: false, user: { ...INITIAL_USER_DATA, id: '' } });
      },

      updateInterests: interests => {
        const { user } = get();
        if (user.userType === 'organizer') return; // Организаторы не имеют интересов

        set(state => ({
          user: { ...state.user, interests },
        }));
      },

      updateProfile: data => {
        set(state => ({
          user: { ...state.user, ...data },
        }));
      },

      becomeOrganizer: () => {
        set(state => {
          const updatedUser: UserData = {
            ...state.user,
            userType: 'organizer',
            role: 'Организатор',
            interests: [], // Удаляем интересы
            followingOrganizerIds: [], // Удаляем подписки
          };
          return {
            user: updatedUser,
            registeredUsers: state.registeredUsers.map(u =>
              u.id === updatedUser.id ? updatedUser : u
            ),
          };
        });
      },

      toggleFollow: organizerId => {
        const { user } = get();
        if (user.userType !== 'explorer') return; // Только исследователи могут подписываться

        const following = user.followingOrganizerIds || [];
        const isAlreadyFollowing = following.includes(organizerId);

        const newList = isAlreadyFollowing
          ? following.filter(id => id !== organizerId)
          : [...following, organizerId];

        set(state => ({
          user: { ...state.user, followingOrganizerIds: newList },
        }));
      },

      isFollowing: organizerId => {
        return get().user.followingOrganizerIds?.includes(organizerId) || false;
      },

      toggleFavorite: eventId => {
        const currentUser = get().user;
        if (currentUser.userType === 'organizer') return;
        const isFav = currentUser.savedEventIds.includes(eventId);
        const newSavedIds = isFav
          ? currentUser.savedEventIds.filter(id => id !== eventId)
          : [...currentUser.savedEventIds, eventId];
        set(state => ({
          user: { ...state.user, savedEventIds: newSavedIds },
        }));
      },

      isFavorite: eventId => get().user.savedEventIds.includes(eventId),
      isPurchased: eventId =>
        get().user.purchasedTickets.some(t => t.eventId === eventId),

      buyTicket: (eventId, quantity) => {
        const currentUser = get().user;
        const newTicket: PurchasedTicket = {
          id: `TICK-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
          eventId,
          quantity,
          purchaseDate: new Date().toISOString(),
        };
        set(state => ({
          user: {
            ...state.user,
            hasTickets: true,
            purchasedTickets: [newTicket, ...state.user.purchasedTickets],
          },
        }));
      },

      clearAllData: async () => {
        await useUserStore.persist.clearStorage();
        set({
          user: { ...INITIAL_USER_DATA, id: '' },
          registeredUsers: [],
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'user-app-storage',
      storage: createJSONStorage(() => customStorage),
    }
  )
);
