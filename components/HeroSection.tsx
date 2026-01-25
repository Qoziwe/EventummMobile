import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  Easing,
  ViewStyle,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useUserStore } from '../store/userStore';
import { ALL_INTERESTS, UserRole, AVAILABLE_CITIES } from '../data/userMockData';
import { useToast } from '../components/ToastProvider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FadeInView = ({ children, delay = 0, style = {} }: any) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [anim, delay]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <Animated.View style={[style, { opacity: anim, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
};

export function AuthScreen() {
  const { register, login, updateInterests, completeRegistration, user } = useUserStore();
  const { showToast } = useToast();
  const flatListRef = useRef<Animated.FlatList<any>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [role, setRole] = useState<UserRole>('explorer');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const floatingAnim = useRef(new Animated.Value(0)).current;
  const cityModalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatingAnim]);

  const steps = useMemo(() => {
    const s = [
      { id: 'welcome', type: 'welcome' },
      { id: 'form', type: 'form' },
    ];

    if (user.id) {
      if (authMode === 'signup' && role === 'explorer') {
        s.push({ id: 'interests', type: 'interests' });
      }
      s.push({ id: 'success', type: 'success' });
    }
    return s;
  }, [authMode, role, user.id]);

  useEffect(() => {
    if (user.id && currentIndex === 1) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: 2, animated: true });
      }, 300);
    }
  }, [user.id]);

  const openCityPicker = () => {
    setShowCityPicker(true);
    Animated.timing(cityModalAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const closeCityPicker = () => {
    Animated.timing(cityModalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowCityPicker(false);
    });
  };

  const scrollToNext = () => {
    if (currentIndex < steps.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const handleStart = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    flatListRef.current?.scrollToIndex({ index: 1, animated: true });
  };

  const handleAuthAction = async () => {
    if (!email || !password) {
      showToast({ message: 'Пожалуйста, заполните почту и пароль', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      if (authMode === 'signup') {
        if (!name) {
          showToast({ message: 'Введите ваше имя', type: 'error' });
          setLoading(false);
          return;
        }
        if (!location) {
          showToast({ message: 'Пожалуйста, выберите ваш город', type: 'error' });
          setLoading(false);
          return;
        }

        const displayRole = role === 'organizer' ? 'Организатор' : 'Исследователь';

        await register({
          name,
          email,
          password,
          userType: role,
          location,
          role: displayRole,
        });

        Keyboard.dismiss();
        showToast({ message: 'Аккаунт успешно создан!', type: 'success' });
      } else {
        const success = await login(email, password);
        if (success) {
          Keyboard.dismiss();
          showToast({ message: 'С возвращением!', type: 'success' });
        } else {
          showToast({ message: 'Неверный email или пароль.', type: 'error' });
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Произошла непредвиденная ошибка';
      showToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFinishInterests = () => {
    if (selectedInterests.length < 3) {
      showToast({ message: 'Выберите хотя бы 3 категории', type: 'info' });
      return;
    }
    updateInterests(selectedInterests);
    scrollToNext();
  };

  const handleFinalAppOpen = () => {
    if (!user || !user.id) {
      showToast({ message: 'Пожалуйста, сначала зарегистрируйтесь', type: 'error' });
      flatListRef.current?.scrollToIndex({ index: 1, animated: true });
      return;
    }
    completeRegistration();
  };

  const renderCityPicker = () => {
    const backdropOpacity = cityModalAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const cardTranslateY = cityModalAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [SCREEN_HEIGHT, 0],
    });

    return (
      <Modal
        visible={showCityPicker}
        transparent
        animationType="none"
        onRequestClose={closeCityPicker}
      >
        <View style={styles.authModalRoot}>
          <Animated.View style={[styles.authModalBackdrop, { opacity: backdropOpacity }]}>
            <TouchableOpacity
              style={styles.flex}
              activeOpacity={1}
              onPress={closeCityPicker}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.authModalCityCard,
              { transform: [{ translateY: cardTranslateY }] },
            ]}
          >
            <View style={styles.authModalHeader}>
              <Text style={styles.authModalTitle}>Выберите город</Text>
              <TouchableOpacity onPress={closeCityPicker}>
                <Ionicons name="close" size={28} color={colors.light.foreground} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.cityListScroll}
            >
              {AVAILABLE_CITIES.map(city => (
                <TouchableOpacity
                  key={city}
                  style={[styles.cityItem, location === city && styles.cityItemActive]}
                  onPress={() => {
                    setLocation(city);
                    closeCityPicker();
                  }}
                >
                  <Text
                    style={[
                      styles.cityItemText,
                      location === city && styles.cityItemTextActive,
                    ]}
                  >
                    {city}
                  </Text>
                  {location === city && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={colors.light.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  const renderStep = ({ item }: { item: any }) => {
    if (item.type === 'welcome') {
      return (
        <View style={styles.page}>
          <Animated.View
            style={[
              styles.iconCircle,
              {
                transform: [
                  {
                    translateY: floatingAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -15],
                    }),
                  },
                ],
              },
            ]}
          >
            <Ionicons name="planet-outline" size={80} color={colors.light.primary} />
          </Animated.View>
          <FadeInView delay={300}>
            <Text style={styles.stepTitle}>
              {'Твой город. Твои люди. \nТвой следующий шаг'}
            </Text>
          </FadeInView>
          <FadeInView delay={500}>
            <Text style={styles.stepDescription}>
              Открой для себя уникальные события или создай свое сообщество. Листай
              вправо, чтобы начать.
            </Text>
          </FadeInView>
          <View style={styles.welcomeButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleStart('signup')}
            >
              <Text style={styles.primaryButtonText}>Начать путь</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => handleStart('login')}
            >
              <Text style={styles.secondaryButtonText}>У меня уже есть аккаунт</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (item.type === 'form') {
      return (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.stepTitle}>
            {authMode === 'signup' ? 'Создай аккаунт' : 'С возвращением!'}
          </Text>
          <View style={styles.form}>
            {authMode === 'signup' && (
              <TextInput
                style={styles.input}
                placeholder="Имя Фамилия"
                placeholderTextColor={colors.light.mutedForeground}
                value={name}
                onChangeText={setName}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.light.mutedForeground}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Пароль"
              placeholderTextColor={colors.light.mutedForeground}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {authMode === 'signup' && (
              <>
                <TouchableOpacity style={styles.citySelector} onPress={openCityPicker}>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={colors.light.primary}
                  />
                  <Text
                    style={[
                      styles.citySelectorText,
                      !location && { color: colors.light.mutedForeground },
                    ]}
                  >
                    {location || 'Выберите ваш город'}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={18}
                    color={colors.light.mutedForeground}
                  />
                </TouchableOpacity>

                <View>
                  <Text style={styles.label}>Выбери свою роль:</Text>
                  <View style={styles.roleContainer}>
                    <TouchableOpacity
                      style={[
                        styles.roleCard,
                        role === 'explorer' && styles.roleCardActive,
                      ]}
                      onPress={() => setRole('explorer')}
                    >
                      <Ionicons
                        name="compass-outline"
                        size={28}
                        color={
                          role === 'explorer'
                            ? colors.light.primary
                            : colors.light.mutedForeground
                        }
                      />
                      <Text
                        style={[
                          styles.roleLabel,
                          role === 'explorer' && styles.roleLabelActive,
                        ]}
                      >
                        Исследователь
                      </Text>
                      <Text style={styles.roleSub}>Ищу крутые ивенты</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.roleCard,
                        role === 'organizer' && styles.roleCardActive,
                      ]}
                      onPress={() => setRole('organizer')}
                    >
                      <Ionicons
                        name="create-outline"
                        size={28}
                        color={
                          role === 'organizer'
                            ? colors.light.primary
                            : colors.light.mutedForeground
                        }
                      />
                      <Text
                        style={[
                          styles.roleLabel,
                          role === 'organizer' && styles.roleLabelActive,
                        ]}
                      >
                        Организатор
                      </Text>
                      <Text style={styles.roleSub}>Создаю движ (Тариф)</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={handleAuthAction}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonInner}>
                <Text style={styles.primaryButtonText}>
                  {authMode === 'signup' ? 'Зарегистрироваться' : 'Войти'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modeSwitch}
            onPress={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
          >
            <Text style={styles.modeSwitchText}>
              {authMode === 'signup'
                ? 'Уже есть аккаунт? Войти'
                : 'Нет аккаунта? Зарегистрироваться'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }

    if (item.type === 'interests') {
      return (
        <View style={styles.page}>
          <Text style={styles.stepTitle}>Твои интересы</Text>
          <Text style={styles.stepDescription}>Выберите минимум 3 категории</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.interestsScroll}
            contentContainerStyle={styles.interestsGrid}
          >
            {ALL_INTERESTS.map(interest => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.interestChip,
                  selectedInterests.includes(interest) && styles.interestChipActive,
                ]}
                onPress={() => {
                  setSelectedInterests(prev =>
                    prev.includes(interest)
                      ? prev.filter(it => it !== interest)
                      : [...prev, interest]
                  );
                }}
              >
                <Text
                  style={[
                    styles.interestText,
                    selectedInterests.includes(interest) && styles.interestTextActive,
                  ]}
                >
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              selectedInterests.length < 3 && styles.disabledButton,
            ]}
            onPress={handleFinishInterests}
            disabled={selectedInterests.length < 3}
          >
            <Text style={styles.primaryButtonText}>
              {'Подтвердить (' + selectedInterests.length + '/3)'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (item.type === 'success') {
      return (
        <View style={styles.page}>
          <View style={styles.successIconWrapper}>
            <Ionicons name="sparkles" size={100} color={colors.light.primary} />
          </View>
          <Text style={styles.stepTitle}>
            {authMode === 'login' ? 'Рады видеть вас снова!' : 'Все готово!'}
          </Text>
          <Text style={styles.stepDescription}>
            {authMode === 'login'
              ? 'Авторизация прошла успешно. Приятного использования!'
              : 'Регистрация успешно завершена. Теперь весь город в твоем смартфоне.'}
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleFinalAppOpen}>
            <Text style={styles.primaryButtonText}>Открыть приложение</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          <View style={styles.pagination}>
            {steps.map((_, i) => {
              const inputRange = [
                (i - 1) * SCREEN_WIDTH,
                i * SCREEN_WIDTH,
                (i + 1) * SCREEN_WIDTH,
              ];
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [10, 30, 10],
                extrapolate: 'clamp',
              });
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={i}
                  style={[styles.dot, { width: dotWidth, opacity }]}
                />
              );
            })}
          </View>
        </View>
        <Animated.FlatList
          ref={flatListRef}
          data={steps}
          extraData={[currentIndex, user.id, authMode, steps.length, location]}
          renderItem={renderStep}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={e =>
            setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH))
          }
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          scrollEnabled={true}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          contentContainerStyle={styles.flatListContent}
        />
      </KeyboardAvoidingView>
      {renderCityPicker()}
    </SafeAreaView>
  );
}

interface FilterItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface FilterOption {
  id: string;
  label: string;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface HeroSectionProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onSearchClear?: () => void;
  onApplyFilters?: (filters: Record<string, string>) => void;
  activeFilters?: Record<string, string>;
  compact?: boolean;
  containerStyle?: ViewStyle;
  autoApply?: boolean;
  showApplyButton?: boolean;
}

const FILTERS_CONFIG: FilterItem[] = [
  { id: 'sort', label: 'Сортировка', icon: 'filter-outline' },
  { id: 'date', label: 'Дата', icon: 'calendar-outline' },
  { id: 'category', label: 'Категория', icon: 'pricetag-outline' },
  { id: 'price', label: 'Цена', icon: 'cash-outline' },
  { id: 'vibe', label: 'Вайб', icon: 'flash-outline' },
  { id: 'time', label: 'Время', icon: 'time-outline' },
  { id: 'age', label: 'Возраст', icon: 'people-outline' },
  { id: 'district', label: 'Район', icon: 'location-outline' },
];

const DAYS = Array.from({ length: 31 }, (_, i) => ({
  id: `d${i + 1}`,
  label: `${i + 1}`,
  value: `${i + 1}`,
}));

const MONTHS = [
  { id: 'm0', label: 'Январь', value: '0' },
  { id: 'm1', label: 'Февраль', value: '1' },
  { id: 'm2', label: 'Март', value: '2' },
  { id: 'm3', label: 'Апрель', value: '3' },
  { id: 'm4', label: 'Май', value: '4' },
  { id: 'm5', label: 'Июнь', value: '5' },
  { id: 'm6', label: 'Июль', value: '6' },
  { id: 'm7', label: 'Август', value: '7' },
  { id: 'm8', label: 'Сентябрь', value: '8' },
  { id: 'm9', label: 'Октябрь', value: '9' },
  { id: 'm10', label: 'Ноябрь', value: '10' },
  { id: 'm11', label: 'Декабрь', value: '11' },
];

const YEARS = [
  { id: 'y2025', label: '2025', value: '2025' },
  { id: 'y2026', label: '2026', value: '2026' },
];

const FILTER_OPTIONS: Record<string, FilterOption[]> = {
  sort: [
    { id: 's1', label: 'Популярное', value: 'popular', icon: 'flame-outline' },
    { id: 's2', label: 'Ближайшие', value: 'soon', icon: 'time-outline' },
    { id: 's3', label: 'Недавно добавленные', value: 'new', icon: 'sparkles-outline' },
  ],
  category: [
    { id: 'c1', label: 'Музыка', value: 'music', icon: 'musical-notes-outline' },
    { id: 'c2', label: 'Искусство', value: 'art', icon: 'color-palette-outline' },
    { id: 'c3', label: 'Спорт', value: 'sport', icon: 'fitness-outline' },
    { id: 'c4', label: 'Обучение', value: 'education', icon: 'school-outline' },
    { id: 'c5', label: 'Театр', value: 'theater', icon: 'film-outline' },
    { id: 'c6', label: 'Бизнес', value: 'business', icon: 'briefcase-outline' },
    { id: 'c7', label: 'Кино', value: 'cinema', icon: 'videocam-outline' },
    { id: 'c8', label: 'Еда', value: 'food', icon: 'restaurant-outline' },
    { id: 'c9', label: 'Технологии', value: 'tech', icon: 'hardware-chip-outline' },
    { id: 'c10', label: 'Путешествия', value: 'travel', icon: 'airplane-outline' },
    { id: 'c11', label: 'Вечеринки', value: 'party', icon: 'wine-outline' },
    { id: 'c12', label: 'Нетворкинг', value: 'networking', icon: 'people-outline' },
    { id: 'c13', label: 'Игры', value: 'games', icon: 'game-controller-outline' },
    { id: 'c14', label: 'Здоровье', value: 'health', icon: 'heart-outline' },
    { id: 'c15', label: 'Мода', value: 'fashion', icon: 'shirt-outline' },
    { id: 'c16', label: 'Танцы', value: 'dance', icon: 'sparkles-outline' },
    {
      id: 'c17',
      label: 'Волонтерство',
      value: 'volunteering',
      icon: 'hand-left-outline',
    },
  ],
  price: [
    { id: 'p1', label: 'Бесплатно', value: 'free', icon: 'gift-outline' },
    { id: 'p2', label: 'до 5 000₸', value: 'low', icon: 'cash-outline' },
    { id: 'p3', label: '5 000₸ - 15 000₸', value: 'medium', icon: 'wallet-outline' },
    { id: 'p4', label: 'от 15 000₸', value: 'high', icon: 'card-outline' },
    { id: 'p5', label: 'Любая цена', value: 'any', icon: 'infinite-outline' },
  ],
  vibe: [
    { id: 'v1', label: 'Активный', value: 'active', icon: 'flash-outline' },
    { id: 'v2', label: 'Спокойный', value: 'chill', icon: 'leaf-outline' },
    { id: 'v3', label: 'Семейный', value: 'family', icon: 'people-outline' },
    { id: 'v4', label: 'Романтичный', value: 'romantic', icon: 'heart-outline' },
    { id: 'v5', label: 'Вечеринка', value: 'party', icon: 'wine-outline' },
  ],
  time: [
    { id: 't1', label: 'Утро (06:00-12:00)', value: 'morning', icon: 'sunny-outline' },
    {
      id: 't2',
      label: 'День (12:00-18:00)',
      value: 'afternoon',
      icon: 'partly-sunny-outline',
    },
    { id: 't3', label: 'Вечер (18:00-00:00)', value: 'evening', icon: 'moon-outline' },
    {
      id: 't4',
      label: 'Ночь (00:00-06:00)',
      value: 'night',
      icon: 'cloudy-night-outline',
    },
  ],
  age: [
    { id: 'a1', label: '0+', value: '0', icon: 'happy-outline' },
    { id: 'a2', label: '6+', value: '6', icon: 'body-outline' },
    { id: 'a3', label: '12+', value: '12', icon: 'accessibility-outline' },
    { id: 'a4', label: '16+', value: '16', icon: 'shield-checkmark-outline' },
    { id: 'a5', label: '18+', value: '18', icon: 'alert-circle-outline' },
    { id: 'a6', label: '21+', value: '21', icon: 'ban-outline' },
  ],
  district: [
    { id: 'l1', label: 'Алмалинский', value: 'Алмалинский', icon: 'map-outline' },
    { id: 'l2', label: 'Медеуский', value: 'Медеуский', icon: 'map-outline' },
    { id: 'l3', label: 'Бостандыкский', value: 'Бостандыкский', icon: 'map-outline' },
    { id: 'l4', label: 'Турксибский', value: 'Турксибский', icon: 'map-outline' },
    { id: 'l5', label: 'Ауэзовский', value: 'Ауэзовский', icon: 'map-outline' },
    { id: 'l6', label: 'Жетысуский', value: 'Жетысуский', icon: 'map-outline' },
    { id: 'l7', label: 'Наурызбайский', value: 'Наурызбайский', icon: 'map-outline' },
    { id: 'l8', label: 'Алатауский', value: 'Алатауский', icon: 'map-outline' },
  ],
};

export default function HeroSection({
  searchPlaceholder = 'Поиск событий, тегов, мест...',
  searchValue = '',
  onSearchChange,
  onSearchClear,
  onApplyFilters,
  activeFilters,
  compact = false,
  containerStyle,
  autoApply = false,
  showApplyButton = true,
}: HeroSectionProps) {
  const [internalFilters, setInternalFilters] = useState<Record<string, string>>(
    activeFilters || {}
  );
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeFilters) setInternalFilters(activeFilters);
  }, [activeFilters]);

  const openModal = (filterId: string) => {
    setActiveFilterId(filterId);
    setIsModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsModalVisible(false);
      setActiveFilterId(null);
    });
  };

  const handleFilterPress = (filterId: string) => openModal(filterId);

  const handleOptionSelect = (key: string, value: string) => {
    const newFilters = { ...internalFilters, [key]: value };
    setInternalFilters(newFilters);
    if (!key.startsWith('date_')) {
      closeModal();
    }
    if (autoApply && onApplyFilters) onApplyFilters(newFilters);
  };

  const getDisplayLabel = (filter: FilterItem) => {
    if (filter.id === 'date') {
      const { date_day, date_month, date_year } = internalFilters;
      if (!date_day && !date_month && !date_year) return 'Дата';
      const mLabel = MONTHS.find(m => m.value === date_month)?.label || '';
      return `${date_day || ''} ${mLabel} ${date_year || ''}`.trim();
    }
    const selectedValue = internalFilters[filter.id];
    if (!selectedValue) return filter.label;
    return (
      FILTER_OPTIONS[filter.id]?.find(opt => opt.value === selectedValue)?.label ||
      filter.label
    );
  };

  const isFilterActive = (filterId: string) => {
    if (filterId === 'date')
      return !!(
        internalFilters.date_day ||
        internalFilters.date_month ||
        internalFilters.date_year
      );
    return !!internalFilters[filterId];
  };

  const resetDate = () => {
    const next = { ...internalFilters };
    delete next.date_day;
    delete next.date_month;
    delete next.date_year;
    setInternalFilters(next);
    if (autoApply) onApplyFilters?.(next);
  };

  return (
    <>
      <View
        style={[styles.container, compact && styles.containerCompact, containerStyle]}
      >
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={colors.light.mutedForeground} />
          <TextInput
            style={styles.searchInput}
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.light.mutedForeground}
            value={searchValue}
            onChangeText={onSearchChange}
          />
          {searchValue.length > 0 && (
            <TouchableOpacity onPress={onSearchClear}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.light.mutedForeground}
              />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {FILTERS_CONFIG.map(filter => {
            const isActive = isFilterActive(filter.id);
            return (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterChip, isActive && styles.activeFilterChip]}
                onPress={() => handleFilterPress(filter.id)}
              >
                <Ionicons
                  name={filter.icon}
                  size={14}
                  color={isActive ? colors.light.primary : colors.light.foreground}
                />
                <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
                  {getDisplayLabel(filter)}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={14}
                  color={isActive ? colors.light.primary : colors.light.mutedForeground}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {showApplyButton && (
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => onApplyFilters?.(internalFilters)}
          >
            <Text style={styles.applyButtonText}>Применить фильтры</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.heroModalRoot}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <Animated.View style={[styles.heroModalOverlay, { opacity: fadeAnim }]} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.heroDropdownContainer,
              activeFilterId === 'date' && styles.heroDateDropdown,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.modalHandle} />
            <View style={styles.heroModalHeader}>
              <Text style={styles.heroDropdownTitle}>
                {activeFilterId === 'date'
                  ? 'Выберите дату'
                  : FILTERS_CONFIG.find(f => f.id === activeFilterId)?.label}
              </Text>
              {activeFilterId === 'date' && (
                <TouchableOpacity onPress={resetDate}>
                  <Text style={styles.resetText}>Сброс</Text>
                </TouchableOpacity>
              )}
            </View>

            {activeFilterId === 'date' ? (
              <View style={styles.datePickerBody}>
                <View style={styles.dateCol}>
                  <Text style={styles.colLabel}>День</Text>
                  <FlatList
                    data={DAYS}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleOptionSelect('date_day', item.value)}
                        style={[
                          styles.dateOpt,
                          internalFilters.date_day === item.value && styles.dateOptActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dateOptText,
                            internalFilters.date_day === item.value &&
                              styles.dateOptTextActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={i => i.id}
                  />
                </View>
                <View style={styles.dateCol}>
                  <Text style={styles.colLabel}>Месяц</Text>
                  <FlatList
                    data={MONTHS}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleOptionSelect('date_month', item.value)}
                        style={[
                          styles.dateOpt,
                          internalFilters.date_month === item.value &&
                            styles.dateOptActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dateOptText,
                            internalFilters.date_month === item.value &&
                              styles.dateOptTextActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={i => i.id}
                  />
                </View>
                <View style={styles.dateCol}>
                  <Text style={styles.colLabel}>Год</Text>
                  <FlatList
                    data={YEARS}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleOptionSelect('date_year', item.value)}
                        style={[
                          styles.dateOpt,
                          internalFilters.date_year === item.value &&
                            styles.dateOptActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dateOptText,
                            internalFilters.date_year === item.value &&
                              styles.dateOptTextActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={i => i.id}
                  />
                </View>
              </View>
            ) : (
              <FlatList
                data={FILTER_OPTIONS[activeFilterId!] || []}
                contentContainerStyle={styles.dropdownListContent}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                renderItem={({ item }) => {
                  const isSelected = internalFilters[activeFilterId!] === item.value;
                  return (
                    <TouchableOpacity
                      style={[styles.dropdownItem, isSelected && styles.selectedItem]}
                      onPress={() => handleOptionSelect(activeFilterId!, item.value)}
                    >
                      <View style={styles.dropdownItemLeft}>
                        {item.icon ? (
                          <Ionicons
                            name={item.icon}
                            size={20}
                            color={
                              isSelected
                                ? colors.light.primary
                                : colors.light.mutedForeground
                            }
                          />
                        ) : (
                          <View
                            style={[styles.bullet, isSelected && styles.bulletActive]}
                          />
                        )}
                        <Text
                          style={[
                            styles.dropdownItemText,
                            isSelected && styles.selectedItemText,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </View>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={22}
                          color={colors.light.primary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={item => item.id}
              />
            )}
            {activeFilterId === 'date' && (
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => {
                  onApplyFilters?.(internalFilters);
                  closeModal();
                }}
              >
                <Text style={styles.confirmBtnText}>Готово</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    backgroundColor: colors.light.background,
  },
  containerCompact: { paddingVertical: spacing.md },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.background,
    borderWidth: 2,
    borderColor: colors.light.border,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  searchInput: { flex: 1, fontSize: typography.base, color: colors.light.foreground },
  filtersContainer: { gap: spacing.sm, paddingBottom: spacing.lg },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.background,
  },
  activeFilterChip: {
    borderColor: colors.light.primary,
    backgroundColor: colors.light.secondary,
  },
  filterText: { fontSize: typography.sm, color: colors.light.foreground },
  activeFilterText: { color: colors.light.primary, fontWeight: '600' },
  applyButton: {
    backgroundColor: colors.light.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  applyButtonText: {
    color: colors.light.primaryForeground,
    fontSize: typography.base,
    fontWeight: '600',
  },
  heroModalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  heroDropdownContainer: {
    width: '90%',
    backgroundColor: colors.light.background,
    borderRadius: 20,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.light.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  heroDateDropdown: { height: 500 },
  heroModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  heroDropdownTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.light.foreground,
  },
  resetText: {
    color: colors.light.primary,
    fontSize: typography.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dropdownListContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: colors.light.border,
    marginHorizontal: spacing.xl,
    opacity: 0.4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  dropdownItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.light.border,
  },
  bulletActive: {
    backgroundColor: colors.light.primary,
    width: 8,
    height: 8,
  },
  selectedItem: {
    backgroundColor: colors.light.secondary,
  },
  dropdownItemText: {
    fontSize: typography.base,
    color: colors.light.foreground,
    fontWeight: '500',
  },
  selectedItemText: {
    fontWeight: '700',
    color: colors.light.primary,
  },
  datePickerBody: { flexDirection: 'row', flex: 1, paddingHorizontal: spacing.sm },
  dateCol: { flex: 1 },
  colLabel: {
    textAlign: 'center',
    fontSize: 10,
    color: colors.light.mutedForeground,
    marginVertical: 4,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dateOpt: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  dateOptActive: { backgroundColor: colors.light.primary },
  dateOptText: { fontSize: 16, color: colors.light.foreground },
  dateOptTextActive: { color: '#fff', fontWeight: '700' },
  confirmBtn: {
    margin: spacing.xl,
    backgroundColor: colors.light.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    shadowColor: colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmBtnText: { color: '#fff', fontWeight: '800', fontSize: typography.base },
  header: { height: 60, justifyContent: 'center', alignItems: 'center' },
  pagination: { flexDirection: 'row', gap: 8 },
  dot: { height: 6, borderRadius: 3, backgroundColor: colors.light.primary },
  flatListContent: {},
  page: {
    width: SCREEN_WIDTH,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  scrollContent: {
    width: SCREEN_WIDTH,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: `${colors.light.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  stepTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.light.foreground,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: spacing.md,
  },
  stepDescription: {
    fontSize: typography.base,
    color: colors.light.mutedForeground,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing['2xl'],
  },
  welcomeButtons: { width: '100%', gap: spacing.md, marginTop: spacing.xl },
  primaryButton: {
    backgroundColor: colors.light.primary,
    width: '100%',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
    elevation: 4,
  },
  primaryButtonText: { color: '#fff', fontSize: typography.base, fontWeight: '800' },
  secondaryButton: {
    width: '100%',
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.light.primary,
    fontSize: typography.sm,
    fontWeight: '700',
  },
  form: { width: '100%', gap: spacing.md, marginBottom: spacing.xl },
  input: {
    backgroundColor: colors.light.card,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    fontSize: typography.base,
    color: colors.light.foreground,
  },
  citySelector: {
    backgroundColor: colors.light.card,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  citySelectorText: {
    flex: 1,
    fontSize: typography.base,
    color: colors.light.foreground,
    fontWeight: '500',
  },
  label: {
    fontSize: typography.sm,
    fontWeight: '800',
    color: colors.light.foreground,
    marginTop: spacing.md,
    textTransform: 'uppercase',
  },
  roleContainer: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  roleCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.light.border,
    backgroundColor: colors.light.card,
    alignItems: 'center',
  },
  roleCardActive: {
    borderColor: colors.light.primary,
    backgroundColor: `${colors.light.primary}08`,
  },
  roleLabel: {
    fontSize: typography.sm,
    fontWeight: '700',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  roleLabelActive: { color: colors.light.primary },
  roleSub: {
    fontSize: 10,
    color: colors.light.mutedForeground,
    marginTop: 4,
    textAlign: 'center',
  },
  buttonInner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modeSwitch: { marginTop: spacing.lg, padding: spacing.md },
  modeSwitchText: {
    color: colors.light.mutedForeground,
    fontSize: typography.sm,
    fontWeight: '600',
  },
  interestsScroll: { width: '100%', maxHeight: '50%', marginBottom: spacing.lg },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  interestChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    backgroundColor: colors.light.background,
  },
  interestChipActive: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  interestText: {
    color: colors.light.foreground,
    fontSize: typography.sm,
    fontWeight: '600',
  },
  interestTextActive: { color: '#fff' },
  disabledButton: { opacity: 0.5 },
  successIconWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: `${colors.light.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  authModalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  authModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  authModalCityCard: {
    backgroundColor: colors.light.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  authModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  authModalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.light.foreground,
  },
  cityListScroll: {
    marginBottom: 20,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  cityItemActive: {
    backgroundColor: `${colors.light.primary}05`,
  },
  cityItemText: {
    fontSize: 16,
    color: colors.light.foreground,
    fontWeight: '500',
  },
  cityItemTextActive: {
    color: colors.light.primary,
    fontWeight: '700',
  },
});
