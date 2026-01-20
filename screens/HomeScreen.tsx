import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, borderRadius, typography } from '../theme/colors';

import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ForYouSection from '../components/ribbons/ForYouSection';
import NextWeekFeed from '../components/ribbons/NextWeekFeed';
import EventsGrid from '../components/EventsGrid';
import CommunityPulse from '../components/CommunityPulse';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';

// Для NextWeekFeed нужен require для изображений или заменим на placeholder
const placeholderImage = require('../assets/placeholder.jpg');

export default function HomeScreen() {
  const navigation = useNavigation();

  // --------------------
  // Данные для популярных событий
  // --------------------
  const popularEvents = [
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
  ];

  // --------------------
  // Данные для блока "Для вас"
  // --------------------
  const forYouEvents = [
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
  // Данные для блока "Следующая неделя"
  // --------------------
  const nextWeekEvents = [
    {
      id: '6',
      title: 'Фестиваль еды в городском парке',
      image: placeholderImage,
      date: '28 фев, 12:00',
      location: 'Парк "Городской"',
      price: 'Бесплатно',
      isPaid: false,
      isPromoted: true,
    },
    {
      id: '7',
      title: 'Киносеанс под открытым небом',
      image: placeholderImage,
      date: '01 мар, 21:00',
      location: 'Площадь "Центральная"',
      price: 'Бесплатно',
      isPaid: false,
      isPromoted: false,
    },
    {
      id: '8',
      title: 'IT-конференция FutureTech',
      image: placeholderImage,
      date: '02 мар, 09:00',
      location: 'Бизнес-центр "Сфера"',
      price: '3000₽',
      isPaid: true,
      isPromoted: true,
    },
    {
      id: '9',
      title: 'Йога в парке на рассвете',
      image: placeholderImage,
      date: '03 мар, 08:00',
      location: 'Парк "Отдыха"',
      price: 'Бесплатно',
      isPaid: false,
      isPromoted: false,
    },
  ];

  // --------------------
  // Данные для обсуждений
  // --------------------
  const popularDiscussions = [
    {
      id: 'd1',
      title: 'Какой ваш любимый музыкальный фестиваль в этом году?',
      author: 'MusicLover',
      timestamp: '2 часа назад',
      replies: 45,
      upvotes: 128,
      category: 'Музыка',
    },
    {
      id: 'd2',
      title: 'Советы для фотографов-новичков на мероприятиях',
      author: 'PhotoPro',
      timestamp: '5 часов назад',
      replies: 23,
      upvotes: 89,
      category: 'Фотография',
    },
    {
      id: 'd3',
      title: 'Какие технологические тренды будут на конференциях в 2024?',
      author: 'TechGuru',
      timestamp: '1 день назад',
      replies: 67,
      upvotes: 156,
      category: 'Технологии',
    },
  ];

  // --------------------
  // Обработчики навигации
  // --------------------
  function openEventDetails(eventId: string) {
    navigation.navigate('EventDetail' as never, { eventId: eventId } as never);
  }

  function openSearch() {
    navigation.navigate('MainTabs' as never, { screen: 'Search' } as never);
  }

  function openProfile() {
    navigation.navigate('MainTabs' as never, { screen: 'Profile' } as never);
  }

  function openAllEvents() {
    navigation.navigate('AllEvents' as never);
  }

  function openCommunities() {
    navigation.navigate('MainTabs' as never, { screen: 'Communities' } as never);
  }

  function openDiscussion(discussionId: string) {
    navigation.navigate('PostThread' as never, { postId: discussionId } as never);
  }

  function openAllDiscussions() {
    navigation.navigate('MainTabs' as never, { screen: 'Communities' } as never);
  }

  // Обработчики для кнопок скролла
  function handleScrollLeft() {
    console.log('Scroll left');
  }

  function handleScrollRight() {
    console.log('Scroll right');
  }

  // --------------------
  // Карточки популярных событий
  // --------------------
  const popularEventCards = popularEvents.map(function (event) {
    return (
      <EventCard
        key={event.id}
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
    );
  });

  // --------------------
  // Карточки "Для вас"
  // --------------------
  const forYouEventCards = forYouEvents.map(function (event) {
    return (
      <EventCard
        key={event.id}
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
    );
  });

  // --------------------
  // Карточки обсуждений
  // --------------------
  const discussionCards = popularDiscussions.map(function (discussion) {
    return (
      <TouchableOpacity
        key={discussion.id}
        style={discussionStyles.card}
        onPress={() => openDiscussion(discussion.id)}
      >
        <View style={discussionStyles.header}>
          <Text style={discussionStyles.category}>{discussion.category}</Text>
          <Text style={discussionStyles.timestamp}>{discussion.timestamp}</Text>
        </View>

        <Text style={discussionStyles.title}>{discussion.title}</Text>

        <View style={discussionStyles.footer}>
          <View style={discussionStyles.authorContainer}>
            <Ionicons
              name="person-circle-outline"
              size={16}
              color={colors.light.mutedForeground}
            />
            <Text style={discussionStyles.author}>{discussion.author}</Text>
          </View>

          <View style={discussionStyles.statsContainer}>
            <View style={discussionStyles.stat}>
              <Ionicons
                name="chatbubble-outline"
                size={14}
                color={colors.light.mutedForeground}
              />
              <Text style={discussionStyles.statText}>{discussion.replies}</Text>
            </View>

            <View style={discussionStyles.stat}>
              <Ionicons
                name="arrow-up-outline"
                size={14}
                color={colors.light.mutedForeground}
              />
              <Text style={discussionStyles.statText}>{discussion.upvotes}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  // --------------------
  // Рендер экрана
  // --------------------
  return (
    <>
      <Header onSearchPress={openSearch} onProfilePress={openProfile} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <HeroSection />

        <ForYouSection>{forYouEventCards}</ForYouSection>

        {/* NextWeekFeed требует пропс events, а не children */}
        <NextWeekFeed
          title="На следующей неделе"
          subtitle="Самые интересные события на ближайшие 7 дней"
          events={nextWeekEvents}
          onScrollLeft={handleScrollLeft}
          onScrollRight={handleScrollRight}
          onEventPress={event => openEventDetails(event.id)}
        />

        <EventsGrid onViewAll={openAllEvents}>{popularEventCards}</EventsGrid>

        {/* Секция обсуждений */}
        <View style={discussionSectionStyles.container}>
          <View style={discussionSectionStyles.header}>
            <Text style={discussionSectionStyles.title}>Популярные обсуждения</Text>
            <TouchableOpacity onPress={openAllDiscussions}>
              <Text style={discussionSectionStyles.viewAll}>Смотреть все</Text>
            </TouchableOpacity>
          </View>

          <View style={discussionSectionStyles.cardsContainer}>{discussionCards}</View>
        </View>

        <CommunityPulse onViewAll={openCommunities} />

        <Footer />
      </ScrollView>
    </>
  );
}

// --------------------
// Стили
// --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
});

// --------------------
// Стили секции обсуждений
// --------------------
const discussionSectionStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  viewAll: {
    fontSize: typography.sm,
    color: colors.light.primary,
    fontWeight: '500',
  },
  cardsContainer: {
    gap: spacing.md,
  },
});

// --------------------
// Стили карточек обсуждений
// --------------------
const discussionStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.card,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  category: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.light.primary,
    backgroundColor: colors.light.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  timestamp: {
    fontSize: typography.xs,
    color: colors.light.mutedForeground,
  },
  title: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.light.foreground,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  author: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
  },
});
