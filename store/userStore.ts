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
          if (isEmailTaken) {
            throw new Error('Пользователь с такой почтой уже существует');
          }
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
          // Если при регистрации передан тип организатор, сохраняем его
          userType: data.userType || 'explorer',
          role: data.userType === 'organizer' ? 'Организатор' : 'Исследователь',
        };

        set(state => ({
          user: newUser,
          registeredUsers: [...state.registeredUsers, newUser],
        }));
      },

      completeRegistration: () => {
        const { user } = get();
        if (user && user.id) {
          set({ isAuthenticated: true });
        }
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
        } else {
          return false;
        }
      },

      logout: () => {
        const { user, registeredUsers } = get();
        if (user.id) {
          const updatedUsers = registeredUsers.map(u => (u.id === user.id ? user : u));
          set({ registeredUsers: updatedUsers });
        }

        set({
          isAuthenticated: false,
          user: { ...INITIAL_USER_DATA, id: '' },
        });
      },

      updateInterests: interests => {
        set(state => {
          const updatedUser = { ...state.user, interests };
          const updatedUsers = state.registeredUsers.map(u =>
            u.id === updatedUser.id ? updatedUser : u
          );
          return {
            user: updatedUser,
            registeredUsers: updatedUsers,
          };
        });
      },

      updateProfile: data => {
        set(state => {
          const initials = data.name
            ? data.name
                .trim()
                .split(/\s+/)
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2)
            : state.user.avatarInitials;

          const updatedUser = {
            ...state.user,
            ...data,
            avatarInitials: initials,
          };

          const updatedUsers = state.registeredUsers.map(u =>
            u.id === updatedUser.id ? updatedUser : u
          );

          return {
            user: updatedUser,
            registeredUsers: updatedUsers,
          };
        });
      },

      becomeOrganizer: () => {
        set(state => {
          const updatedUser: UserData = {
            ...state.user,
            userType: 'organizer',
            role: 'Организатор',
          };
          const updatedUsers = state.registeredUsers.map(u =>
            u.id === updatedUser.id ? updatedUser : u
          );
          return {
            user: updatedUser,
            registeredUsers: updatedUsers,
          };
        });
      },

      toggleFavorite: (eventId: string) => {
        const currentUser = get().user;
        // Организаторы не могут сохранять в избранное
        if (currentUser.userType === 'organizer') return;

        const isFav = currentUser.savedEventIds.includes(eventId);
        const newSavedIds = isFav
          ? currentUser.savedEventIds.filter(id => id !== eventId)
          : [...currentUser.savedEventIds, eventId];

        const updatedUser = { ...currentUser, savedEventIds: newSavedIds };

        set(state => ({
          user: updatedUser,
          registeredUsers: state.registeredUsers.map(u =>
            u.id === updatedUser.id ? updatedUser : u
          ),
        }));
      },

      isFavorite: (eventId: string) => get().user.savedEventIds.includes(eventId),
      isPurchased: (eventId: string) =>
        get().user.purchasedTickets.some(t => t.eventId === eventId),

      buyTicket: (eventId: string, quantity: number) => {
        const currentUser = get().user;
        const newTicket: PurchasedTicket = {
          id: `TICK-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
          eventId,
          quantity,
          purchaseDate: new Date().toISOString(),
        };

        const updatedUser = {
          ...currentUser,
          hasTickets: true,
          purchasedTickets: [newTicket, ...currentUser.purchasedTickets],
        };

        set(state => ({
          user: updatedUser,
          registeredUsers: state.registeredUsers.map(u =>
            u.id === updatedUser.id ? updatedUser : u
          ),
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
