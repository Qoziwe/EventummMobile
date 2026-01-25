import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { ALL_EVENTS, DetailedEventItem } from '../data/mockData';

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
      else await AsyncStorage.setItem(name, value);
    } catch {}
  },
};

export interface AppEvent extends DetailedEventItem {
  organizerId?: string;
}

interface EventState {
  events: AppEvent[];
  addEvent: (event: AppEvent) => void;
  updateEvent: (event: AppEvent) => void; // Добавлена функция обновления
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => AppEvent | undefined;
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: ALL_EVENTS,

      addEvent: event => {
        set(state => ({
          events: [event, ...state.events],
        }));
      },

      updateEvent: updatedEvent => {
        set(state => ({
          events: state.events.map(e => (e.id === updatedEvent.id ? updatedEvent : e)),
        }));
      },

      deleteEvent: id => {
        set(state => ({
          events: state.events.filter(e => e.id !== id),
        }));
      },

      getEventById: id => {
        return get().events.find(e => e.id === id);
      },
    }),
    {
      name: 'event-app-storage',
      storage: createJSONStorage(() => customStorage),
    }
  )
);
