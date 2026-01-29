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
  password?: string;
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
  followingOrganizerIds: string[];
  birthDate: string; // Новое поле: ISO дата рождения (ГГГГ-ММ-ДД)
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
  location: '',
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
  followingOrganizerIds: [],
  birthDate: '2000-01-01', // Значение по умолчанию (взрослый), пока нет экрана ввода
};
