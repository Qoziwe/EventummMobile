// types/index.ts или components/EventCard.tsx
export interface EventItem {
  id: string;
  title: string;
  date: string;
  timestamp: number;
  location: string;
  price: string;
  priceValue: number;
  categories: string[];
  vibe: 'party' | 'chill';
  tags: string[];
  stats?: number; // опционально
  image: string;
  description?: string; // опционально
  organizer?: string; // опционально
  isPopular?: boolean; // опционально
  addedAt: string;
}
