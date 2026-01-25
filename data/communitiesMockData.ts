export interface CommentData {
  id: string;
  authorName: string;
  timestamp: string;
  content: string;
  upvotes: number;
  downvotes: number;
  depth: number;
  replies?: CommentData[];
}

export interface PostData {
  id: string;
  communityId: string;
  authorName: string;
  timestamp: string;
  content: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
}

export interface CommunityItem {
  id: string;
  name: string;
  members: number;
  category: string;
  categorySlug: string;
  description: string;
  isPrivate: boolean;
  isPopular?: boolean;
}

export const COMMUNITIES: CommunityItem[] = [
  {
    id: '1',
    name: 'Музыкальные фестивали',
    members: 1250,
    category: 'Музыка',
    categorySlug: 'music',
    description: 'Обсуждаем лучшие музыкальные мероприятия и делимся впечатлениями.',
    isPrivate: false,
    isPopular: true,
  },
  {
    id: '2',
    name: 'Tech Talks',
    members: 890,
    category: 'Технологии',
    categorySlug: 'tech',
    description: 'ИТ-конференции, митапы и встречи разработчиков в городе.',
    isPrivate: false,
    isPopular: true,
  },
  {
    id: '4',
    name: 'Спортивные болельщики',
    members: 2100,
    category: 'Спорт',
    categorySlug: 'sport',
    description: 'Обсуждения матчей, турниров и совместные походы на стадионы.',
    isPrivate: false,
    isPopular: true,
  },
  {
    id: '5',
    name: 'Гурманы и Рестораторы',
    members: 3400,
    category: 'Еда',
    categorySlug: 'food',
    description: 'Ищем лучшие заведения города и обсуждаем гастро-фестивали.',
    isPrivate: false,
    isPopular: true,
  },
];

export const MOCK_POSTS: PostData[] = [
  {
    id: 'post-music-1',
    communityId: '1',
    authorName: 'RockLover',
    timestamp: '2 ч. назад',
    content: 'Ребят, кто едет на Summer Sound? Ищу компанию для поездки из центра!',
    upvotes: 45,
    downvotes: 2,
    commentCount: 3,
  },
  {
    id: 'post-tech-1',
    communityId: '2',
    authorName: 'DevMaster',
    timestamp: '5 ч. назад',
    content:
      'На следующей неделе будет митап по React Native. Кто-нибудь планирует выступать?',
    upvotes: 120,
    downvotes: 5,
    commentCount: 2,
  },
  {
    id: 'post-sport-1',
    communityId: '4',
    authorName: 'UltraFan',
    timestamp: '1 ч. назад',
    content:
      'Какой прогноз на сегодняшний матч? Думаю, наши заберут победу со счетом 2:1.',
    upvotes: 89,
    downvotes: 12,
    commentCount: 1,
  },
  {
    id: 'post-food-1',
    communityId: '5',
    authorName: 'ChefAlex',
    timestamp: '10 мин. назад',
    content: 'Открыл для себя новую кофейню в старом городе. Зерна просто пушка!',
    upvotes: 34,
    downvotes: 0,
    commentCount: 1,
  },
];

export const MOCK_COMMENTS: Record<string, CommentData[]> = {
  'post-music-1': [
    {
      id: 'c1',
      authorName: 'Meloman',
      timestamp: '1 ч. назад',
      content: 'Я еду! Могу подхватить на метро Октябрьская.',
      upvotes: 10,
      downvotes: 0,
      depth: 0,
      replies: [
        {
          id: 'c1-1',
          authorName: 'RockLover',
          timestamp: '40 мин. назад',
          content: 'Супер, пишу в личку!',
          upvotes: 2,
          downvotes: 0,
          depth: 1,
        },
      ],
    },
    {
      id: 'c2',
      authorName: 'VibeCheck',
      timestamp: '30 мин. назад',
      content: 'Блин, я в этот раз пропускаю :(',
      upvotes: 1,
      downvotes: 0,
      depth: 0,
    },
  ],
  'post-tech-1': [
    {
      id: 'c3',
      authorName: 'JuniorDev',
      timestamp: '2 ч. назад',
      content: 'Я приду послушать, докладов пока нет.',
      upvotes: 15,
      downvotes: 0,
      depth: 0,
    },
    {
      id: 'c4',
      authorName: 'SeniorHiring',
      timestamp: '1 ч. назад',
      content: 'Мы будем там хантить, заходите на стенд.',
      upvotes: 50,
      downvotes: 1,
      depth: 0,
    },
  ],
  'post-sport-1': [
    {
      id: 'c5',
      authorName: 'GoalHunter',
      timestamp: '10 мин. назад',
      content: 'Согласен, форма у них сейчас отличная.',
      upvotes: 5,
      downvotes: 0,
      depth: 0,
    },
  ],
  'post-food-1': [
    {
      id: 'c6',
      authorName: 'LatteArt',
      timestamp: '5 мин. назад',
      content: 'Адрес в студию! Тоже хочу заценить.',
      upvotes: 3,
      downvotes: 0,
      depth: 0,
    },
  ],
};
