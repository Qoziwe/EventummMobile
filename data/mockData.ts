import { EventItem } from '../components/EventCard';

const toTS = (dateStr: string) => new Date(dateStr).getTime();

export interface DetailedEventItem extends EventItem {
  fullDescription: string;
  organizerName: string;
  organizerAvatar: string;
  timeRange: string;
  organizerId: string; // Сделали обязательным
}

export const ALL_EVENTS: DetailedEventItem[] = [
  {
    id: '1',
    organizerId: 'mock_org_1',
    title: 'Концерт группы "Звёзды"',
    date: '24 янв, 20:00',
    timestamp: toTS('2026-01-24T20:00:00'),
    location: 'Клуб "Арена", Медеуский',
    price: 'от 5000₸',
    priceValue: 5000,
    categories: ['music'],
    vibe: 'party',
    district: 'Медеуский',
    ageLimit: 18,
    tags: ['рок', 'живой звук', 'open-air'],
    stats: 1250,
    image:
      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800&auto=format&fit=crop',
    addedAt: '2026-01-10',
    fullDescription: 'Главное музыкальное событие этой зимы!',
    organizerName: 'Arena Live Group',
    organizerAvatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
    timeRange: '20:00 — 23:30',
  },
  {
    id: '2',
    organizerId: 'mock_org_2',
    title: 'Выставка современного искусства',
    date: '25 янв, 10:00',
    timestamp: toTS('2026-01-25T10:00:00'),
    location: 'Галерея "Арт", Алмалинский',
    price: 'Бесплатно',
    priceValue: 0,
    categories: ['art'],
    vibe: 'chill',
    district: 'Алмалинский',
    ageLimit: 0,
    tags: ['арт', 'бесплатно', 'культура'],
    stats: 320,
    image:
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop',
    addedAt: '2026-01-12',
    fullDescription: 'Погрузитесь в мир современного искусства.',
    organizerName: 'Almaty Art Foundation',
    organizerAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    timeRange: '10:00 — 19:00',
  },
  {
    id: '3',
    organizerId: 'mock_org_3',
    title: 'Футбольный матч: Кайрат vs Астана',
    date: '26 янв, 19:00',
    timestamp: toTS('2026-01-26T19:00:00'),
    location: 'Стадион "Центральный", Бостандыкский',
    price: '3000₸',
    priceValue: 3000,
    categories: ['sport'],
    vibe: 'party',
    district: 'Бостандыкский',
    ageLimit: 0,
    tags: ['футбол', 'матч', 'дерби'],
    stats: 15000,
    image:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    addedAt: '2026-01-15',
    fullDescription: 'Главное дерби страны!',
    organizerName: 'Kairat FC',
    organizerAvatar:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=200&auto=format&fit=crop',
    timeRange: '19:00 — 21:00',
  },
];
