import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Добавь этот импорт
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, borderRadius, typography } from '../theme/colors';
import Header from '../components/Header';

// --------------------
// Типы
// --------------------
interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: string;
  category: string;
  views: number;
  imageUrl?: string;
}

interface SearchScreenProps {
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onSearchClear?: () => void;
  onSearchSubmit?: () => void;
  recentSearches?: string[];
  onRecentSearchPress?: (search: string) => void;
  popularTags?: string[];
  onTagPress?: (tag: string) => void;
  onQuickFilter?: (filter: string) => void;
  showResults?: boolean;
}

export default function SearchScreen(props: SearchScreenProps) {
  const navigation = useNavigation(); // Добавь хук навигации

  // --------------------
  // Мок-данные мероприятий
  // --------------------
  const mockEvents: EventItem[] = [
    {
      id: '1',
      title: 'Рок-фестиваль в Алматы',
      description: 'Крупнейший рок-фестиваль года с участием звёзд мировой сцены',
      date: '15 июня 2024',
      location: 'Алматы Арена',
      price: 'от 5000 ₸',
      category: 'Концерт',
      views: 12500,
      imageUrl: 'https://picsum.photos/seed/concert1/300/200',
    },
    {
      id: '2',
      title: 'Выставка современного искусства',
      description: 'Работы современных казахстанских художников',
      date: '10-25 мая 2024',
      location: 'Музей искусств',
      price: '1500 ₸',
      category: 'Искусство',
      views: 8900,
      imageUrl: 'https://picsum.photos/seed/art1/300/200',
    },
    {
      id: '3',
      title: 'Фестиваль еды "Вкус Востока"',
      description: 'Гастрономический фестиваль с блюдами национальной кухни',
      date: '20-22 мая 2024',
      location: 'Парк Первого Президента',
      price: 'Бесплатно',
      category: 'Фестиваль',
      views: 15600,
      imageUrl: 'https://picsum.photos/seed/food1/300/200',
    },
    {
      id: '4',
      title: 'Бизнес-конференция "StartUp Kazakhstan"',
      description: 'Встреча инвесторов и стартаперов со всей страны',
      date: '5 июня 2024',
      location: 'Rixos Hotel',
      price: '25000 ₸',
      category: 'Бизнес',
      views: 5400,
      imageUrl: 'https://picsum.photos/seed/business1/300/200',
    },
    {
      id: '5',
      title: 'Театральная премьера "Абай"',
      description: 'Новая постановка по произведениям Абая Кунанбаева',
      date: 'Каждый четверг',
      location: 'Казахский театр драмы',
      price: 'от 3000 ₸',
      category: 'Театр',
      views: 7200,
      imageUrl: 'https://picsum.photos/seed/theater1/300/200',
    },
    {
      id: '6',
      title: 'Марафон по Алматы',
      description: 'Ежегодный городской марафон на 10 км и 21 км',
      date: '8 июня 2024',
      location: 'Стадион "Алматы Арена"',
      price: 'Бесплатно',
      category: 'Спорт',
      views: 21000,
      imageUrl: 'https://picsum.photos/seed/sport1/300/200',
    },
    {
      id: '7',
      title: 'Джазовый вечер',
      description: 'Выступления лучших джазовых коллективов города',
      date: '18 мая 2024',
      location: 'Jazz Club Almaty',
      price: '4000 ₸',
      category: 'Концерт',
      views: 4800,
      imageUrl: 'https://picsum.photos/seed/jazz1/300/200',
    },
    {
      id: '8',
      title: 'Выставка "Нур-Султан: 25 лет"',
      description: 'Фотографии и артефакты из истории столицы',
      date: '1-30 мая 2024',
      location: 'Национальный музей',
      price: '1000 ₸',
      category: 'История',
      views: 6300,
      imageUrl: 'https://picsum.photos/seed/history1/300/200',
    },
  ];

  // --------------------
  // Состояние
  // --------------------
  const [searchValue, setSearchValue] = useState(props.searchValue || '');
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const recentSearches = props.recentSearches || [];
  const popularTags = props.popularTags || [
    'Концерт',
    'Бесплатно',
    'Спорт',
    'Искусство',
    'Фестиваль',
    'Театр',
    'Бизнес',
    'Вечеринка',
  ];

  // --------------------
  // Обработчики навигации
  // --------------------
  const handleBackPress = () => {
    navigation.goBack(); // Используй навигацию
  };

  const handleProfilePress = () => {
    // Используй ту же логику, что и в HomeScreen
    navigation.navigate('MainTabs' as never, { screen: 'Profile' } as never);
  };

  // --------------------
  // Функции поиска
  // --------------------
  const handleSearch = (text: string) => {
    setSearchValue(text);

    if (props.onSearchChange) {
      props.onSearchChange(text);
    }

    if (text.trim().length > 0) {
      setIsSearching(true);
      // Фильтрация мероприятий по поисковому запросу
      const filtered = mockEvents.filter(
        event =>
          event.title.toLowerCase().includes(text.toLowerCase()) ||
          event.description.toLowerCase().includes(text.toLowerCase()) ||
          event.category.toLowerCase().includes(text.toLowerCase()) ||
          event.location.toLowerCase().includes(text.toLowerCase())
      );
      // Сортировка по количеству просмотров (по убыванию)
      const sorted = filtered.sort((a, b) => b.views - a.views);
      setFilteredEvents(sorted);
    } else {
      setIsSearching(false);
      setFilteredEvents([]);
    }
  };

  const handleSearchClear = () => {
    setSearchValue('');
    setFilteredEvents([]);
    setIsSearching(false);

    if (props.onSearchClear) {
      props.onSearchClear();
    }
  };

  const handleSearchSubmit = () => {
    setIsSearching(true);

    if (props.onSearchSubmit) {
      props.onSearchSubmit();
    }
  };

  const handleTagPress = (tag: string) => {
    setSearchValue(tag);
    setIsSearching(true);

    const filtered = mockEvents.filter(
      event =>
        event.category.toLowerCase().includes(tag.toLowerCase()) ||
        event.title.toLowerCase().includes(tag.toLowerCase())
    );
    const sorted = filtered.sort((a, b) => b.views - a.views);
    setFilteredEvents(sorted);

    if (props.onTagPress) {
      props.onTagPress(tag);
    }
  };

  const handleQuickFilter = (filter: string) => {
    let filtered: EventItem[] = [];

    switch (filter) {
      case 'popular':
        filtered = [...mockEvents].sort((a, b) => b.views - a.views);
        setSearchValue('Популярное');
        break;
      case 'today':
        filtered = mockEvents.filter(
          event => event.date.includes('сегодня') || event.date.includes('май')
        );
        setSearchValue('Сегодня');
        break;
      case 'free':
        filtered = mockEvents.filter(event =>
          event.price.toLowerCase().includes('бесплатно')
        );
        setSearchValue('Бесплатно');
        break;
      case 'nearby':
        filtered = mockEvents.filter(event => event.location.includes('Алматы'));
        setSearchValue('Рядом');
        break;
    }

    const sorted = filtered.sort((a, b) => b.views - a.views);
    setFilteredEvents(sorted);
    setIsSearching(true);

    if (props.onQuickFilter) {
      props.onQuickFilter(filter);
    }
  };

  const handleRecentSearchPress = (search: string) => {
    setSearchValue(search);
    setIsSearching(true);

    const filtered = mockEvents.filter(
      event =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase())
    );
    const sorted = filtered.sort((a, b) => b.views - a.views);
    setFilteredEvents(sorted);

    if (props.onRecentSearchPress) {
      props.onRecentSearchPress(search);
    }
  };

  // --------------------
  // Рендер мероприятия
  // --------------------
  const renderEventItem = (event: EventItem) => (
    <TouchableOpacity key={event.id} style={styles.eventCard}>
      <View style={styles.eventImageContainer}>
        <Image
          source={{ uri: event.imageUrl }}
          style={styles.eventImage}
          resizeMode="cover"
        />
        <View style={styles.eventCategoryBadge}>
          <Text style={styles.eventCategoryText}>{event.category}</Text>
        </View>
      </View>

      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description}
        </Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetailItem}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.light.mutedForeground}
            />
            <Text style={styles.eventDetailText}>{event.date}</Text>
          </View>

          <View style={styles.eventDetailItem}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.light.mutedForeground}
            />
            <Text style={styles.eventDetailText}>{event.location}</Text>
          </View>
        </View>

        <View style={styles.eventFooter}>
          <Text style={styles.eventPrice}>{event.price}</Text>

          <View style={styles.eventViews}>
            <Ionicons name="eye-outline" size={14} color={colors.light.mutedForeground} />
            <Text style={styles.eventViewsText}>{event.views.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // --------------------
  // Условия отображения
  // --------------------
  const hasSearchText = searchValue.length > 0;
  const showSearchResults = isSearching && filteredEvents.length > 0;

  // --------------------
  // Рендер
  // --------------------
  return (
    <View style={styles.fullContainer}>
      <Header
        showBack={true}
        onBackPress={handleBackPress}
        title="Поиск"
        showSearch={false}
        onProfilePress={handleProfilePress}
      />

      <View style={styles.container}>
        {/* Search header */}
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={colors.light.mutedForeground} />

            <TextInput
              style={styles.searchInput}
              placeholder="Поиск событий, тегов, мест..."
              placeholderTextColor={colors.light.mutedForeground}
              value={searchValue}
              onChangeText={handleSearch}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              autoFocus
            />

            {hasSearchText ? (
              <TouchableOpacity onPress={handleSearchClear}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={colors.light.mutedForeground}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {showSearchResults ? (
            // --------------------
            // Результаты поиска
            // --------------------
            <View style={styles.resultsSection}>
              <Text style={styles.sectionTitle}>
                Найдено {filteredEvents.length} мероприятий по запросу "{searchValue}"
              </Text>
              <View style={styles.resultsList}>
                {filteredEvents.map(renderEventItem)}
              </View>
            </View>
          ) : (
            // --------------------
            // Контент по умолчанию
            // --------------------
            <>
              {/* Recent searches */}
              {recentSearches.length > 0 ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Недавние запросы</Text>

                  <View style={styles.recentList}>
                    {recentSearches.map(function (search, index) {
                      return (
                        <TouchableOpacity
                          key={index}
                          style={styles.recentItem}
                          onPress={() => handleRecentSearchPress(search)}
                        >
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color={colors.light.mutedForeground}
                          />
                          <Text style={styles.recentText}>{search}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ) : null}

              {/* Popular tags */}
              {popularTags.length > 0 ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Популярные теги</Text>

                  <View style={styles.tagsContainer}>
                    {popularTags.map(function (tag, index) {
                      return (
                        <TouchableOpacity
                          key={index}
                          style={styles.tag}
                          onPress={() => handleTagPress(tag)}
                        >
                          <Text style={styles.tagText}>{tag}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ) : null}

              {/* Quick filters */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Быстрые фильтры</Text>

                <View style={styles.quickFilters}>
                  <TouchableOpacity
                    style={styles.quickFilter}
                    onPress={() => handleQuickFilter('popular')}
                  >
                    <Ionicons
                      name="flame-outline"
                      size={20}
                      color={colors.light.primary}
                    />
                    <Text style={styles.quickFilterText}>Популярное</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.quickFilter}
                    onPress={() => handleQuickFilter('today')}
                  >
                    <Ionicons
                      name="today-outline"
                      size={20}
                      color={colors.light.primary}
                    />
                    <Text style={styles.quickFilterText}>Сегодня</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.quickFilter}
                    onPress={() => handleQuickFilter('free')}
                  >
                    <Ionicons
                      name="gift-outline"
                      size={20}
                      color={colors.light.primary}
                    />
                    <Text style={styles.quickFilterText}>Бесплатно</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.quickFilter}
                    onPress={() => handleQuickFilter('nearby')}
                  >
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color={colors.light.primary}
                    />
                    <Text style={styles.quickFilterText}>Рядом</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Popular events */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Популярные сейчас</Text>
                <View style={styles.resultsList}>
                  {mockEvents
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 3)
                    .map(renderEventItem)}
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

// --------------------
// Стили
// --------------------
const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.secondary,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.base,
    color: colors.light.foreground,
  },
  section: {
    padding: spacing.lg,
  },
  resultsSection: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.light.foreground,
    marginBottom: spacing.md,
  },
  recentList: {
    gap: spacing.sm,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  recentText: {
    fontSize: typography.base,
    color: colors.light.foreground,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.light.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  tagText: {
    fontSize: typography.sm,
    color: colors.light.foreground,
  },
  quickFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickFilter: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  quickFilterText: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colors.light.foreground,
  },
  resultsList: {
    gap: spacing.md,
  },
  eventCard: {
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  eventImageContainer: {
    position: 'relative',
    height: 160,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  eventCategoryBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.light.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  eventCategoryText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.light.primaryForeground,
  },
  eventContent: {
    padding: spacing.md,
  },
  eventTitle: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.light.foreground,
    marginBottom: spacing.xs,
  },
  eventDescription: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  eventDetails: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  eventDetailText: {
    fontSize: typography.xs,
    color: colors.light.mutedForeground,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventPrice: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.light.primary,
  },
  eventViews: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  eventViewsText: {
    fontSize: typography.xs,
    color: colors.light.mutedForeground,
  },
});
