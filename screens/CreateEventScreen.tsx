import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useEventStore } from '../store/eventStore';
import { useUserStore } from '../store/userStore';
import { useToast } from '../components/ToastProvider';
import { ALL_INTERESTS } from '../data/userMockData';

const DAYS = Array.from({ length: 31 }, (_, i) => ({
  id: `d${i + 1}`,
  label: `${i + 1}`,
  value: `${i + 1}`,
}));

const MONTHS = [
  { id: 'm0', label: 'Января', value: '0' },
  { id: 'm1', label: 'Февраля', value: '1' },
  { id: 'm2', label: 'Марта', value: '2' },
  { id: 'm3', label: 'Апреля', value: '3' },
  { id: 'm4', label: 'Мая', value: '4' },
  { id: 'm5', label: 'Июня', value: '5' },
  { id: 'm6', label: 'Июля', value: '6' },
  { id: 'm7', label: 'Августа', value: '7' },
  { id: 'm8', label: 'Сентября', value: '8' },
  { id: 'm9', label: 'Октября', value: '9' },
  { id: 'm10', label: 'Ноября', value: '10' },
  { id: 'm11', label: 'Декабря', value: '11' },
];

const YEARS = [
  { id: 'y2025', label: '2025', value: '2025' },
  { id: 'y2026', label: '2026', value: '2026' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

const VIBES = [
  { id: 'active', label: 'Активный', icon: 'flash' },
  { id: 'chill', label: 'Спокойный', icon: 'leaf' },
  { id: 'family', label: 'Семейный', icon: 'people' },
  { id: 'romantic', label: 'Романтичный', icon: 'heart' },
  { id: 'party', label: 'Вечеринка', icon: 'wine' },
];

const DISTRICTS = [
  'Алмалинский',
  'Медеуский',
  'Бостандыкский',
  'Турксибский',
  'Ауэзовский',
  'Жетысуский',
  'Наурызбайский',
  'Алатауский',
];

const NO_IMAGE_URL =
  'https://images.unsplash.com/photo-1590608897129-79da98d15969?q=80&w=1200&auto=format&fit=crop';

export default function CreateEventScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { addEvent, updateEvent } = useEventStore();
  const { user } = useUserStore();
  const { showToast } = useToast();

  const editEvent = route.params?.event; // Данные для редактирования

  const [step, setStep] = useState(1);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState(DISTRICTS[0]);

  // Date State
  const [selDay, setSelDay] = useState('1');
  const [selMonth, setSelMonth] = useState('0');
  const [selYear, setSelYear] = useState('2025');

  // Time State
  const [startH, setStartH] = useState('19');
  const [startM, setStartM] = useState('00');
  const [endH, setEndH] = useState('21');
  const [endM, setEndM] = useState('00');

  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(ALL_INTERESTS[0]);
  const [vibe, setVibe] = useState('chill');
  const [ageLimit, setAgeLimit] = useState('18');
  const [imageUrl, setImageUrl] = useState('');

  // Modals
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Инициализация при редактировании
  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setDescription(editEvent.fullDescription);
      // Убираем район из строки локации для отображения в инпуте
      const cleanLocation = editEvent.location.split(', ')[0];
      setLocation(cleanLocation);
      setDistrict(editEvent.district);
      setPrice(editEvent.priceValue.toString());
      setCategory(editEvent.categories?.[0] || ALL_INTERESTS[0]);
      setVibe(editEvent.vibe);
      setAgeLimit(editEvent.ageLimit.toString());
      setImageUrl(editEvent.image);

      // Парсинг даты (упрощенно)
      const dateObj = new Date(editEvent.timestamp);
      if (!isNaN(dateObj.getTime())) {
        setSelDay(dateObj.getDate().toString());
        setSelMonth(dateObj.getMonth().toString());
        setSelYear(dateObj.getFullYear().toString());
        setStartH(dateObj.getHours().toString().padStart(2, '0'));
        setStartM(dateObj.getMinutes().toString().padStart(2, '0'));
      }
    }
  }, [editEvent]);

  const handleNext = () => {
    if (step === 1 && (!title || !description)) {
      showToast({ message: 'Заполните основные поля', type: 'error' });
      return;
    }
    if (step === 2 && !location) {
      showToast({ message: 'Заполните данные о месте', type: 'error' });
      return;
    }
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigation.goBack();
  };

  const handleFinish = () => {
    const finalImage = imageUrl.trim().length > 10 ? imageUrl : NO_IMAGE_URL;

    const monthLabel = MONTHS.find(m => m.value === selMonth)?.label;
    const dateString = `${selDay} ${monthLabel}, ${selYear}`;
    const timeRangeString = `${startH}:${startM} — ${endH}:${endM}`;

    const tsDate = new Date(
      parseInt(selYear),
      parseInt(selMonth),
      parseInt(selDay),
      parseInt(startH),
      parseInt(startM)
    );

    const eventData = {
      id: editEvent ? editEvent.id : `event_${Math.random().toString(36).substr(2, 9)}`,
      organizerId: user.id,
      title,
      date: dateString,
      timestamp: tsDate.getTime(),
      location: `${location}, ${district}`,
      price: price === '0' || price === '' ? 'Бесплатно' : `${price}₸`,
      priceValue: parseInt(price) || 0,
      categories: [category.toLowerCase()],
      vibe: vibe as any,
      district,
      ageLimit: parseInt(ageLimit) || 0,
      tags: [category, vibe],
      stats: editEvent ? editEvent.stats : 0,
      image: finalImage,
      fullDescription: description,
      organizerName: user.name || 'Организатор',
      organizerAvatar: user.avatarUrl || '',
      timeRange: timeRangeString,
    };

    if (editEvent) {
      updateEvent(eventData);
      showToast({ message: 'Мероприятие обновлено', type: 'success' });
      // Возвращаемся в детали
      navigation.navigate('EventDetail', { ...eventData });
    } else {
      addEvent(eventData);
      showToast({ message: 'Мероприятие опубликовано', type: 'success' });
      navigation.navigate('MainTabs', { screen: 'Profile' });
    }
  };

  const renderPickerItem = (item: any, current: string, setter: (v: string) => void) => (
    <TouchableOpacity
      onPress={() => setter(item.value || item)}
      style={[
        styles.pickerOpt,
        (item.value === current || item === current) && styles.pickerOptActive,
      ]}
    >
      <Text
        style={[
          styles.pickerOptText,
          (item.value === current || item === current) && styles.pickerOptTextActive,
        ]}
      >
        {item.label || item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <View style={styles.progressWrapper}>
          <Text style={styles.headerTitle}>
            {editEvent ? 'Редактирование' : 'Создание'}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.stepIndicator}>Шаг {step} из 3</Text>

          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.label}>Название</Text>
              <TextInput
                style={styles.input}
                placeholder="Название мероприятия"
                value={title}
                onChangeText={setTitle}
              />
              <Text style={styles.label}>Описание</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Расскажите о событии..."
                multiline
                value={description}
                onChangeText={setDescription}
                textAlignVertical="top"
              />
              <Text style={styles.label}>URL Изображения</Text>
              <TextInput
                style={styles.input}
                placeholder="https://..."
                value={imageUrl}
                onChangeText={setImageUrl}
              />
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.label}>Адрес</Text>
              <TextInput
                style={styles.input}
                placeholder="Улица, дом"
                value={location}
                onChangeText={setLocation}
              />

              <Text style={styles.label}>Район</Text>
              <View style={styles.chipGrid}>
                {DISTRICTS.map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.chip, district === d && styles.chipActive]}
                    onPress={() => setDistrict(d)}
                  >
                    <Text
                      style={[styles.chipText, district === d && styles.chipTextActive]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Дата</Text>
              <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={colors.light.primary}
                />
                <Text style={styles.selectorButtonText}>
                  {selDay} {MONTHS.find(m => m.value === selMonth)?.label} {selYear}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Время проведения</Text>
              <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color={colors.light.primary} />
                <Text style={styles.selectorButtonText}>
                  С {startH}:{startM} до {endH}:{endM}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.label}>Категория</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.catScroll}
              >
                <View style={styles.chipGrid}>
                  {ALL_INTERESTS.map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.chip, category === cat && styles.chipActive]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          category === cat && styles.chipTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <Text style={styles.label}>Вайб</Text>
              <View style={styles.iconGrid}>
                {VIBES.map(v => (
                  <TouchableOpacity
                    key={v.id}
                    style={[styles.iconCard, vibe === v.id && styles.iconCardActive]}
                    onPress={() => setVibe(v.id)}
                  >
                    <Ionicons
                      name={v.icon as any}
                      size={24}
                      color={
                        vibe === v.id
                          ? colors.light.primary
                          : colors.light.mutedForeground
                      }
                    />
                    <Text
                      style={[styles.iconLabel, vibe === v.id && styles.iconLabelActive]}
                    >
                      {v.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Цена (₸)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0 (бесплатно)"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Возраст</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="18"
                    keyboardType="numeric"
                    value={ageLimit}
                    onChangeText={setAgeLimit}
                  />
                </View>
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.mainButton, step === 3 && styles.createButton]}
              onPress={step === 3 ? handleFinish : handleNext}
            >
              <Text style={styles.mainButtonText}>
                {step === 3
                  ? editEvent
                    ? 'Сохранить изменения'
                    : 'Опубликовать'
                  : 'Далее'}
              </Text>
              <Ionicons
                name={step === 3 ? (editEvent ? 'save' : 'rocket') : 'chevron-forward'}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Выберите дату</Text>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerCol}>
                <Text style={styles.colLabel}>День</Text>
                <FlatList
                  data={DAYS}
                  renderItem={({ item }) => renderPickerItem(item, selDay, setSelDay)}
                  keyExtractor={i => i.id}
                />
              </View>
              <View style={styles.pickerCol}>
                <Text style={styles.colLabel}>Месяц</Text>
                <FlatList
                  data={MONTHS}
                  renderItem={({ item }) => renderPickerItem(item, selMonth, setSelMonth)}
                  keyExtractor={i => i.id}
                />
              </View>
              <View style={styles.pickerCol}>
                <Text style={styles.colLabel}>Год</Text>
                <FlatList
                  data={YEARS}
                  renderItem={({ item }) => renderPickerItem(item, selYear, setSelYear)}
                  keyExtractor={i => i.id}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.modalCloseBtnText}>Применить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showTimePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Время (Начало — Конец)</Text>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerCol}>
                <Text style={styles.colLabel}>Час нач.</Text>
                <FlatList
                  data={HOURS}
                  renderItem={({ item }) => renderPickerItem(item, startH, setStartH)}
                  keyExtractor={i => i}
                />
              </View>
              <View style={styles.pickerCol}>
                <Text style={styles.colLabel}>Мин нач.</Text>
                <FlatList
                  data={MINUTES}
                  renderItem={({ item }) => renderPickerItem(item, startM, setStartM)}
                  keyExtractor={i => i}
                />
              </View>
              <View style={{ width: 20 }} />
              <View style={styles.pickerCol}>
                <Text style={styles.colLabel}>Час кон.</Text>
                <FlatList
                  data={HOURS}
                  renderItem={({ item }) => renderPickerItem(item, endH, setEndH)}
                  keyExtractor={i => i}
                />
              </View>
              <View style={styles.pickerCol}>
                <Text style={styles.colLabel}>Мин кон.</Text>
                <FlatList
                  data={MINUTES}
                  renderItem={({ item }) => renderPickerItem(item, endM, setEndM)}
                  keyExtractor={i => i}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={styles.modalCloseBtnText}>Применить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: colors.light.background },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  progressWrapper: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.light.foreground },
  progressBar: {
    width: 100,
    height: 4,
    backgroundColor: colors.light.border,
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.light.primary },
  container: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: 100 },
  stepIndicator: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.light.primary,
    textTransform: 'uppercase',
    marginBottom: spacing.lg,
  },
  stepContainer: { gap: spacing.md },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.foreground,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: 16,
    color: colors.light.foreground,
  },
  textArea: { height: 120 },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: 12,
  },
  selectorButtonText: { fontSize: 16, color: colors.light.foreground, fontWeight: '500' },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catScroll: { marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.card,
  },
  chipActive: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  chipText: { fontSize: 12, color: colors.light.foreground, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  iconCard: {
    width: '31%',
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: 6,
  },
  iconCardActive: {
    borderColor: colors.light.primary,
    backgroundColor: `${colors.light.primary}08`,
  },
  iconLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.light.mutedForeground,
    textAlign: 'center',
  },
  iconLabelActive: { color: colors.light.primary },
  row: { flexDirection: 'row', gap: 10 },
  footer: { marginTop: 40 },
  mainButton: {
    backgroundColor: colors.light.foreground,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  createButton: { backgroundColor: colors.light.primary },
  mainButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.light.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    height: 450,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.light.foreground,
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: { flexDirection: 'row', flex: 1 },
  pickerCol: { flex: 1 },
  colLabel: {
    textAlign: 'center',
    fontSize: 10,
    color: colors.light.mutedForeground,
    marginBottom: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  pickerOpt: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  pickerOptActive: { backgroundColor: colors.light.primary },
  pickerOptText: { fontSize: 16, color: colors.light.foreground },
  pickerOptTextActive: { color: '#fff', fontWeight: '700' },
  modalCloseBtn: {
    backgroundColor: colors.light.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCloseBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
