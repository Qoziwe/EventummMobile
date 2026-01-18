import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../theme/colors';

import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ForYouSection from '../components/ribbons/ForYouSection';
import NextWeekFeed from '../components/ribbons/NextWeekFeed';
import EventsGrid from '../components/EventsGrid';
import CommunityPulse from '../components/CommunityPulse';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';

// Для NextWeekFeed нужен require для изображений или заменим на placeholder
const placeholderImage = require('../assets/placeholder.jpg'); // Создайте этот файл или используйте другой

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
      image: placeholderImage, // Требуется require или импорт локального изображения
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
