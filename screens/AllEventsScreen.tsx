import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  TouchableOpacity as RNTouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, borderRadius, typography } from '../theme/colors';

// --------------------
// Типы
// --------------------
interface CategoryItem {
  id: string;
  label: string;
  icon: string;
}

interface AllEventsScreenProps {
  categories?: CategoryItem[];
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onBack?: () => void;
  resultsCount?: number;
  children?: React.ReactNode;
}

// --------------------
// Категории по умолчанию
// --------------------
const defaultCategories: CategoryItem[] = [
  { id: 'all', label: 'Все', icon: '' },
  { id: 'music', label: 'Музыка', icon: '' },
  { id: 'tech', label: 'Технологии', icon: '' },
  { id: 'art', label: 'Искусство', icon: '' },
  { id: 'food', label: 'Еда', icon: '' },
  { id: 'business', label: 'Бизнес', icon: '' },
  { id: 'sport', label: 'Спорт', icon: '' },
];

// --------------------
// Кастомная EventCard для AllEventsScreen
// --------------------
interface CustomEventCardProps {
  id: string;
  title: string;
  date: string;
  venue: string;
  attendees: number;
  price: string;
  category: string;
  imageUri: string;
  onPress: () => void;
}

function CustomEventCard({
  id,
  title,
  date,
  venue,
  attendees,
  price,
  category,
  imageUri,
  onPress,
}: CustomEventCardProps) {
  return (
    <RNTouchableOpacity style={eventCardStyles.container} onPress={onPress}>
      {/* Image */}
      <View style={eventCardStyles.imageContainer}>
        {/* Здесь будет изображение */}
        <View style={eventCardStyles.imagePlaceholder} />
        <View style={eventCardStyles.categoryBadge}>
          <Text style={eventCardStyles.categoryText}>{category}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={eventCardStyles.content}>
        <Text style={eventCardStyles.title} numberOfLines={2}>
          {title}
        </Text>
        
        <View style={eventCardStyles.infoContainer}>
          <View style={eventCardStyles.infoRow}>
            <Ionicons name="time-outline" size={12} color={colors.light.mutedForeground} />
            <Text style={eventCardStyles.infoText}>{date}</Text>
          </View>
          <View style={eventCardStyles.infoRow}>
            <Ionicons name="location-outline" size={12} color={colors.light.mutedForeground} />
            <Text style={eventCardStyles.infoText}>{venue}</Text>
          </View>
          <View style={eventCardStyles.infoRow}>
            <Ionicons name="people-outline" size={12} color={colors.light.mutedForeground} />
            <Text style={eventCardStyles.infoText}>{attendees} участников</Text>
          </View>
        </View>

        <View style={eventCardStyles.priceContainer}>
          <Text style={eventCardStyles.priceText}>{price}</Text>
        </View>
      </View>
    </RNTouchableOpacity>
  );
}

// --------------------
// Стили для кастомной карточки
// --------------------
const eventCardStyles = StyleSheet.create({
  container: {
    flex: 1, // Занимает всю доступную ширину в обертке
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    aspectRatio: 16 / 9, // Соотношение сторон изображения
    position: "relative",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.light.muted,
  },
  categoryBadge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.light.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  categoryText: {
    fontSize: typography.xs,
    fontWeight: "600",
    color: colors.light.primaryForeground,
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.sm,
    fontWeight: "700",
    color: colors.light.foreground,
    lineHeight: 18,
  },
  infoContainer: {
    gap: spacing.xs,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  infoText: {
    fontSize: typography.xs,
    color: colors.light.mutedForeground,
    flex: 1,
  },
  priceContainer: {
    marginTop: spacing.xs,
  },
  priceText: {
    fontSize: typography.sm,
    fontWeight: "700",
    color: colors.light.primary,
  },
});

export default function AllEventsScreen(props: AllEventsScreenProps) {
  const navigation = useNavigation<any>();

  // --------------------
  // Пропсы с значениями по умолчанию
  // --------------------
  const categories = props.categories || defaultCategories;
  const selectedCategory = props.selectedCategory || 'all';
  const searchValue = props.searchValue || '';
  const resultsCount = props.resultsCount || 0;

  // --------------------
  // Данные мероприятий (mock)
  // --------------------
  const events = [
    {
      id: '1',
      title: 'Концерт группы "Звёзды"',
      date: '15 фев, 20:00',
      venue: 'Клуб "Арена"',
      attendees: 250,
      price: 'от 500₽',
      category: 'Музыка',
      imageUri: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      title: 'Выставка современного искусства',
      date: '18 фев, 10:00',
      venue: 'Галерея "Арт"',
      attendees: 80,
      price: 'Бесплатно',
      category: 'Искусство',
      imageUri: 'https://via.placeholder.com/150',
    },
    {
      id: '3',
      title: 'Футбольный матч',
      date: '20 фев, 19:00',
      venue: 'Стадион "Центральный"',
      attendees: 500,
      price: 'от 300₽',
      category: 'Спорт',
      imageUri: 'https://via.placeholder.com/150',
    },
    {
      id: '4',
      title: 'Мастер-класс по фотографии',
      date: '22 фев, 14:00',
      venue: 'Студия "Фокус"',
      attendees: 25,
      price: '1500₽',
      category: 'Образование',
      imageUri: 'https://via.placeholder.com/150',
    },
    {
      id: '5',
      title: 'Театральная постановка',
      date: '25 фев, 18:00',
      venue: 'Театр "Маска"',
      attendees: 120,
      price: 'от 800₽',
      category: 'Театр',
      imageUri: 'https://via.placeholder.com/150',
    },
  ];

  // --------------------
  // Обработчики
  // --------------------
  function goBack() {
    if (props.onBack) {
      props.onBack();
    } else {
      navigation.goBack();
    }
  }

  function openEventDetails(eventId: string) {
    navigation.navigate('EventDetail' as never, { eventId: eventId } as never);
  }

  function changeSearch(text: string) {
    if (props.onSearchChange) {
      props.onSearchChange(text);
    }
  }

  function selectCategory(categoryId: string) {
    if (props.onCategorySelect) {
      props.onCategorySelect(categoryId);
    }
  }

  // --------------------
  // Карточки мероприятий
  // --------------------
  const eventCards = events.map(function (event) {
    return (
      <View key={event.id} style={styles.eventCardWrapper}>
        <CustomEventCard
          id={event.id}
          title={event.title}
          date={event.date}
          venue={event.venue}
          attendees={event.attendees}
          price={event.price}
          category={event.category}
          imageUri={event.imageUri}
          onPress={() => openEventDetails(event.id)}
        />
      </View>
    );
  });

  // --------------------
  // Рендер
  // --------------------
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Все мероприятия</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.light.mutedForeground} />

        <TextInput
          style={styles.searchInput}
          placeholder="Поиск мероприятий..."
          placeholderTextColor={colors.light.mutedForeground}
          value={searchValue}
          onChangeText={changeSearch}
        />
      </View>

      {/* Categories - Обертка с фиксированной высотой */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(function (category) {
            const isActive = selectedCategory === category.id;

            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryChip, isActive ? styles.categoryChipActive : null]}
                onPress={() => selectCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryLabel,
                    isActive ? styles.categoryLabelActive : null,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>Найдено {events.length} мероприятий</Text>
      </View>

      {/* Events Grid */}
      <ScrollView
        contentContainerStyle={styles.eventsContainer}
        showsVerticalScrollIndicator={false}
        style={styles.eventsScroll}
      >
        <View style={styles.eventsGrid}>
          {eventCards}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --------------------
// Стили для основного экрана
// --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.light.foreground,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
    height: 44,
    backgroundColor: colors.light.secondary,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.base,
    color: colors.light.foreground,
  },
  categoriesWrapper: {
    height: 60,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
    paddingTop: spacing.lg,
  },
  categoryChip: {
    width: 75,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.light.background,
    borderWidth: 1,
    borderColor: colors.light.border,
    flexShrink: 0,
  },
  categoryChipActive: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  categoryLabel: {
    fontSize: typography.sm,
    color: colors.light.foreground,
  },
  categoryLabelActive: {
    color: colors.light.primaryForeground,
  },
  resultsHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  resultsText: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
  },
  eventsScroll: {
    flex: 1,
  },
  eventsContainer: {
    flexGrow: 1,
  },
  eventsGrid: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  eventCardWrapper: {
    width: '48%', // Ровно половина минус отступы
    marginBottom: spacing.md,
  },
});