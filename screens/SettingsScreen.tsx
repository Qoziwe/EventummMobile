// --------------------
// Импорты
// --------------------
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Text } from 'react-native';

// --------------------
// Компоненты настроек
// --------------------
import {
  FeedOrderSelector,
  DiscoveryToggle,
  ForYouControls,
  InterestsSection,
  AppPreferencesSection,
  type FeedOrderOption,
  type ThemeOption,
  type LanguageOption,
} from '../components/SettingsComponents';

// --------------------
// Данные
// --------------------
const MOCK_INTERESTS = [
  'Music',
  'Technology',
  'Art & Culture',
  'Sports',
  'Food & Drink',
  'Networking',
];

// --------------------
// Основной компонент
// --------------------
export function SettingsScreen() {
  // --------------------
  // Состояние
  // --------------------
  const [feedOrder, setFeedOrder] = useState<FeedOrderOption>('random');
  const [isPersonalized, setIsPersonalized] = useState(true);
  const [isTimeFilterEnabled, setIsTimeFilterEnabled] = useState(true);
  const [interests] = useState<string[]>(MOCK_INTERESTS);
  const [theme, setTheme] = useState<ThemeOption>('system');
  const [language, setLanguage] = useState<LanguageOption>('en');

  // --------------------
  // Функции-обработчики
  // --------------------
  function handleEditInterests() {
    // Навигация на экран редактирования интересов
  }

  function handleLanguagePress() {
    // Показ модального окна выбора языка
  }

  function handleFeedOrderChange(order: FeedOrderOption) {
    setFeedOrder(order);
  }

  function handlePersonalizedToggle(value: boolean) {
    setIsPersonalized(value);
  }

  function handleTimeFilterToggle(value: boolean) {
    setIsTimeFilterEnabled(value);
  }

  function handleThemeChange(newTheme: ThemeOption) {
    setTheme(newTheme);
  }

  // --------------------
  // Подготовка JSX
  // --------------------
  const headerTitle = 'Settings';
  const headerSubtitle = 'Customize your Eventum experience';

  // --------------------
  // Рендер
  // --------------------
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Заголовок экрана */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>
        </View>

        {/* Раздел 1: Порядок ленты */}
        <FeedOrderSelector
          selectedOrder={feedOrder}
          onOrderChange={handleFeedOrderChange}
        />

        {/* Раздел 2: Персонализация */}
        <DiscoveryToggle
          isPersonalized={isPersonalized}
          onToggle={handlePersonalizedToggle}
        />

        {/* Раздел 3: Для вас */}
        <ForYouControls
          isTimeFilterEnabled={isTimeFilterEnabled}
          onTimeFilterToggle={handleTimeFilterToggle}
        />

        {/* Раздел 4: Интересы */}
        <InterestsSection interests={interests} onEditPress={handleEditInterests} />

        {/* Раздел 5: Настройки приложения */}
        <AppPreferencesSection
          selectedTheme={theme}
          selectedLanguage={language}
          onThemeChange={handleThemeChange}
          onLanguagePress={handleLanguagePress}
        />

        {/* Отступ внизу */}
        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --------------------
// Стили
// --------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6B7280',
  },
  footer: {
    height: 40,
  },
});

export default SettingsScreen;
