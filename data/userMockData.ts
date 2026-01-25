export interface PurchasedTicket {
  id: string;
  eventId: string;
  quantity: number;
  purchaseDate: string;
}

export interface UserStats {
  eventsAttended: number;
  communitiesJoined: number;
}

export type UserRole = 'explorer' | 'organizer';

export interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string; // Для имитации бэкенда
  phone: string;
  location: string;
  bio: string;
  avatarInitials: string;
  avatarUrl?: string | null;
  role: string;
  userType: UserRole;
  subscriptionType: string;
  subscriptionStatus: 'premium' | 'basic' | 'none';
  interests: string[];
  stats: UserStats;
  hasTickets: boolean;
  savedEventIds: string[];
  purchasedTickets: PurchasedTicket[];
}

export const ALL_INTERESTS = [
  'Музыка',
  'Искусство',
  'Спорт',
  'Обучение',
  'Театр',
  'Бизнес',
  'Технологии',
  'Нетворкинг',
  'Гастрономия',
  'Путешествия',
  'Кино',
  'Игры',
  'Благотворительность',
  'Мода',
  'Здоровье',
];

// Список городов без указания страны
export const AVAILABLE_CITIES = [
  'Алматы',
  'Астана',
  'Шымкент',
  'Караганда',
  'Актобе',
  'Тараз',
  'Павлодар',
  'Усть-Каменогорск',
  'Семей',
];

export const INITIAL_USER_DATA: UserData = {
  id: '',
  name: '',
  username: '',
  email: '',
  phone: '',
  location: '', // Пусто по умолчанию
  bio: '',
  avatarInitials: '',
  avatarUrl: null,
  role: 'Пользователь',
  userType: 'explorer',
  subscriptionType: 'None',
  subscriptionStatus: 'none',
  interests: [],
  stats: {
    eventsAttended: 0,
    communitiesJoined: 0,
  },
  hasTickets: false,
  savedEventIds: [],
  purchasedTickets: [],
};
