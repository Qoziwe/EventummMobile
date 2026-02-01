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
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useEventStore } from '../store/eventStore';
import { useUserStore } from '../store/userStore';
import { useToast } from '../components/ToastProvider';
import { ALL_INTERESTS } from '../data/userMockData';
import { sanitizeText } from '../utils/security';
import { validateEventDate } from '../utils/dateUtils';
import { apiClient } from '../api/apiClient';

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

export default function CreateEventScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { addEvent, updateEvent, deleteEvent } = useEventStore();
  const { user } = useUserStore();
  const { showToast } = useToast();

  const editEvent = route.params?.event;

  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState(DISTRICTS[0]);

  const [selDay, setSelDay] = useState('1');
  const [selMonth, setSelMonth] = useState('0');
  const [selYear, setSelYear] = useState('2025');

  const [startH, setStartH] = useState('19');
  const [startM, setStartM] = useState('00');
  const [endH, setEndH] = useState('21');
  const [endM, setEndM] = useState('00');

  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(ALL_INTERESTS[0]);
  const [vibe, setVibe] = useState('chill');
  const [ageLimit, setAgeLimit] = useState('18');
  const [imageUrl, setImageUrl] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title || '');
      setDescription(editEvent.fullDescription || '');

      if (editEvent.location) {
        const parts = editEvent.location.split(', ');
        setLocation(parts[0] || '');
        const districtToSet =
          editEvent.district || (parts.length > 1 ? parts[parts.length - 1] : '');
        const foundDistrict = DISTRICTS.find(d => d.trim() === districtToSet.trim());
        if (foundDistrict) {
          setDistrict(foundDistrict);
        }
      }

      setPrice(editEvent.priceValue?.toString() || '0');

      if (editEvent.categories && editEvent.categories.length > 0) {
        const eventCat = editEvent.categories[0].toLowerCase();
        const foundCat = ALL_INTERESTS.find(c => c.toLowerCase() === eventCat);
        if (foundCat) setCategory(foundCat);
      }

      setVibe(editEvent.vibe || 'chill');
      setAgeLimit(editEvent.ageLimit?.toString() || '18');
      setImageUrl(editEvent.image || '');

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

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsUploading(true);
        const asset = result.assets[0];
        const uri = asset.uri;
        const formData = new FormData();

        // --- ИСПРАВЛЕНИЕ: Гарантируем корректное имя файла с расширением ---
        let filename = uri.split('/').pop();

        // Если имя файла отсутствует или не содержит точку (часто в Web blob:...),
        // принудительно добавляем расширение .jpg, чтобы бэкенд пропустил файл.
        if (!filename || !filename.includes('.')) {
          filename = `image_${Date.now()}.jpg`;
        }

        // Определяем mime type на основе расширения
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        if (Platform.OS === 'web') {
          // ДЛЯ WEB: Конвертируем URI в Blob и передаем имя файла
          const response = await fetch(uri);
          const blob = await response.blob();
          formData.append('image', blob, filename);
        } else {
          // ДЛЯ NATIVE
          formData.append('image', {
            uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
            name: filename,
            type,
          } as any);
        }

        const res = await apiClient('events/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (res.imageUrl) {
          setImageUrl(res.imageUrl);
          showToast({ message: 'Изображение загружено', type: 'success' });
        }
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      showToast({ message: 'Ошибка при загрузке изображения', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

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

  const handleDelete = () => {
    Alert.alert(
      'Удалить событие?',
      'Вы уверены, что хотите безвозвратно удалить это мероприятие?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              if (editEvent && editEvent.id) {
                await deleteEvent(editEvent.id);
                showToast({ message: 'Мероприятие удалено', type: 'success' });
                navigation.navigate('MainTabs', { screen: 'Profile' });
              }
            } catch (error) {
              showToast({ message: 'Ошибка при удалении', type: 'error' });
            }
          },
        },
      ]
    );
  };

  const handleFinish = async () => {
    if (editEvent) {
      if (!user.id || editEvent.organizerId !== user.id) {
        showToast({
          message: 'У вас нет прав на редактирование этого события',
          type: 'error',
        });
        navigation.goBack();
        return;
      }
    }

    if (!editEvent && user.userType !== 'organizer') {
      showToast({
        message: 'Только организаторы могут создавать события',
        type: 'error',
      });
      navigation.goBack();
      return;
    }

    if (!imageUrl) {
      showToast({ message: 'Загрузите обложку мероприятия', type: 'error' });
      return;
    }

    const dateValidation = validateEventDate(selYear, selMonth, selDay);
    if (!dateValidation.valid) {
      showToast({
        message: dateValidation.message || 'Некорректная дата',
        type: 'error',
      });
      return;
    }

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

    if (isNaN(tsDate.getTime())) {
      showToast({ message: 'Некорректная дата или время', type: 'error' });
      return;
    }

    const sanitizedTitle = sanitizeText(title);
    const sanitizedDescription = sanitizeText(description);
    const sanitizedLocation = sanitizeText(location);

    const eventData = {
      ...(editEvent ? { id: editEvent.id } : {}),
      organizerId: user.id!,
      title: sanitizedTitle,
      date: dateString,
      timestamp: tsDate.getTime(),
      location: `${sanitizedLocation}, ${district}`,
      price: price === '0' || price === '' ? 'Бесплатно' : `${price}₸`,
      priceValue: parseInt(price) || 0,
      categories: [category.toLowerCase()],
      vibe: vibe as any,
      district,
      ageLimit: parseInt(ageLimit) || 0,
      tags: [category, vibe],
      stats: editEvent ? editEvent.stats : 0,
      image: imageUrl,
      fullDescription: sanitizedDescription,
      organizerName: sanitizeText(user.name || 'Организатор'),
      organizerAvatar: user.avatarUrl || '',
      timeRange: timeRangeString,
    };

    try {
      if (editEvent) {
        await updateEvent(eventData as any);
        showToast({ message: 'Мероприятие обновлено', type: 'success' });
        navigation.navigate('EventDetail', { ...eventData });
      } else {
        await addEvent(eventData as any);
        showToast({ message: 'Мероприятие опубликовано', type: 'success' });
        navigation.navigate('MainTabs', { screen: 'Profile' });
      }
    } catch (error: any) {
      showToast({
        message: error.message || 'Ошибка при сохранении события',
        type: 'error',
      });
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
        <TouchableOpacity style={styles.headerBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {editEvent ? 'Редактирование' : 'Новое событие'}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
          </View>
        </View>
        <View style={styles.headerBtn} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.stepIndicator}>Шаг {step} из 3</Text>

          {step === 1 && (
            <View style={styles.formSection}>
              <Text style={styles.label}>Обложка мероприятия</Text>
              <TouchableOpacity
                style={[
                  styles.imageUploadContainer,
                  imageUrl ? styles.imageUploaded : null,
                ]}
                onPress={pickImage}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator color={colors.light.primary} size="large" />
                ) : imageUrl ? (
                  <>
                    <Image source={{ uri: imageUrl }} style={styles.previewImage} />
                    <View style={styles.changeImageBadge}>
                      <Ionicons name="camera" size={16} color="#fff" />
                      <Text style={styles.changeImageText}>Сменить фото</Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons
                      name="image-outline"
                      size={48}
                      color={colors.light.mutedForeground}
                    />
                    <Text style={styles.placeholderText}>
                      Нажмите, чтобы выбрать фото
                    </Text>
                    <Text style={styles.placeholderSubtext}>
                      Рекомендуемый размер 16:9
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <Text style={styles.label}>Название события</Text>
              <TextInput
                style={styles.input}
                placeholder="Как называется ваше мероприятие?"
                value={title}
                onChangeText={setTitle}
              />
              <Text style={styles.label}>Описание</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Подробно опишите, что ждет гостей..."
                multiline
                value={description}
                onChangeText={setDescription}
                textAlignVertical="top"
              />
            </View>
          )}

          {step === 2 && (
            <View style={styles.formSection}>
              <Text style={styles.label}>Где пройдет?</Text>
              <TextInput
                style={styles.input}
                placeholder="Улица, дом, название места"
                value={location}
                onChangeText={setLocation}
              />

              <Text style={styles.label}>Выберите район</Text>
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

              <Text style={styles.label}>Когда?</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={colors.light.primary}
                />
                <Text style={styles.selectorText}>
                  {selDay} {MONTHS.find(m => m.value === selMonth)?.label} {selYear}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Время начала и конца</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={18} color={colors.light.primary} />
                <Text style={styles.selectorText}>
                  С {startH}:{startM} до {endH}:{endM}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View style={styles.formSection}>
              <Text style={styles.label}>Категория</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.catScroll}
              >
                <View style={styles.chipGridHorizontal}>
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

              <Text style={styles.label}>Вайб (атмосфера)</Text>
              <View style={styles.vibeGrid}>
                {VIBES.map(v => (
                  <TouchableOpacity
                    key={v.id}
                    style={[styles.vibeCard, vibe === v.id && styles.vibeCardActive]}
                    onPress={() => setVibe(v.id)}
                  >
                    <Ionicons
                      name={v.icon as any}
                      size={20}
                      color={
                        vibe === v.id
                          ? colors.light.primary
                          : colors.light.mutedForeground
                      }
                    />
                    <Text
                      style={[styles.vibeLabel, vibe === v.id && styles.vibeLabelActive]}
                    >
                      {v.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Цена (₸)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
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

          <View style={styles.footerActions}>
            <TouchableOpacity
              style={[styles.btnMain, step === 3 && styles.btnFinish]}
              onPress={step === 3 ? handleFinish : handleNext}
            >
              <Text style={styles.btnMainText}>
                {step === 3 ? (editEvent ? 'Сохранить' : 'Опубликовать') : 'Продолжить'}
              </Text>
              <Ionicons
                name={step === 3 ? (editEvent ? 'save' : 'rocket') : 'chevron-forward'}
                size={18}
                color="#fff"
              />
            </TouchableOpacity>

            {step === 3 && editEvent && (
              <TouchableOpacity style={styles.btnDelete} onPress={handleDelete}>
                <Text style={styles.btnDeleteText}>Удалить событие</Text>
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Выберите дату</Text>
            <View style={styles.pickerWrap}>
              <View style={styles.pickerCol}>
                <Text style={styles.colName}>День</Text>
                <FlatList
                  data={DAYS}
                  renderItem={({ item }) => renderPickerItem(item, selDay, setSelDay)}
                  keyExtractor={i => i.id}
                />
              </View>
              <View style={styles.pickerCol}>
                <Text style={styles.colName}>Месяц</Text>
                <FlatList
                  data={MONTHS}
                  renderItem={({ item }) => renderPickerItem(item, selMonth, setSelMonth)}
                  keyExtractor={i => i.id}
                />
              </View>
              <View style={styles.pickerCol}>
                <Text style={styles.colName}>Год</Text>
                <FlatList
                  data={YEARS}
                  renderItem={({ item }) => renderPickerItem(item, selYear, setSelYear)}
                  keyExtractor={i => i.id}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.btnModal}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.btnModalText}>Применить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showTimePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Время события</Text>
            <View style={styles.pickerWrap}>
              <View style={styles.pickerCol}>
                <Text style={styles.colName}>Час нач.</Text>
                <FlatList
                  data={HOURS}
                  renderItem={({ item }) => renderPickerItem(item, startH, setStartH)}
                  keyExtractor={i => i}
                />
              </View>
              <View style={styles.pickerCol}>
                <Text style={styles.colName}>Мин нач.</Text>
                <FlatList
                  data={MINUTES}
                  renderItem={({ item }) => renderPickerItem(item, startM, setStartM)}
                  keyExtractor={i => i}
                />
              </View>
              <View style={{ width: 15 }} />
              <View style={styles.pickerCol}>
                <Text style={styles.colName}>Час кон.</Text>
                <FlatList
                  data={HOURS}
                  renderItem={({ item }) => renderPickerItem(item, endH, setEndH)}
                  keyExtractor={i => i}
                />
              </View>
              <View style={styles.pickerCol}>
                <Text style={styles.colName}>Мин кон.</Text>
                <FlatList
                  data={MINUTES}
                  renderItem={({ item }) => renderPickerItem(item, endM, setEndM)}
                  keyExtractor={i => i}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.btnModal}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={styles.btnModalText}>Применить</Text>
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
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerContent: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontSize: typography.base,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  progressBar: {
    width: 80,
    height: 3,
    backgroundColor: colors.light.secondary,
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.light.primary },
  container: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: 60 },
  stepIndicator: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.light.primary,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  formSection: { gap: 14 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.foreground,
    marginBottom: 2,
  },
  input: {
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.lg,
    padding: 12,
    fontSize: 14,
    color: colors.light.foreground,
  },
  textArea: { height: 100 },
  imageUploadContainer: {
    width: '100%',
    height: 180,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.light.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageUploaded: {
    borderStyle: 'solid',
    borderColor: colors.light.primary,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.foreground,
    marginTop: 8,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 11,
    color: colors.light.mutedForeground,
    marginTop: 4,
  },
  changeImageBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  changeImageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.lg,
    padding: 12,
    gap: 10,
  },
  selectorText: { fontSize: 14, color: colors.light.foreground, fontWeight: '500' },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  catScroll: { marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg },
  chipGridHorizontal: { flexDirection: 'row', gap: 6 },
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
  chipText: { fontSize: 11, color: colors.light.foreground, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  vibeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  vibeCard: {
    width: '31%',
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.lg,
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  vibeCardActive: {
    borderColor: colors.light.primary,
    backgroundColor: `${colors.light.primary}08`,
  },
  vibeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.light.mutedForeground,
    textAlign: 'center',
  },
  vibeLabelActive: { color: colors.light.primary },
  inputRow: { flexDirection: 'row', gap: 10 },
  footerActions: { marginTop: 32, gap: 12 },
  btnMain: {
    backgroundColor: colors.light.foreground,
    padding: 14,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnFinish: { backgroundColor: colors.light.primary },
  btnMainText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  btnDelete: {
    backgroundColor: 'transparent',
    padding: 14,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  btnDeleteText: { color: '#EF4444', fontSize: 15, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: colors.light.background,
    borderRadius: borderRadius.xl,
    padding: 20,
    maxHeight: 420,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.light.foreground,
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerWrap: { flexDirection: 'row', height: 250 },
  pickerCol: { flex: 1 },
  colName: {
    textAlign: 'center',
    fontSize: 9,
    color: colors.light.mutedForeground,
    marginBottom: 6,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  pickerOpt: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  pickerOptActive: { backgroundColor: colors.light.primary },
  pickerOptText: { fontSize: 14, color: colors.light.foreground },
  pickerOptTextActive: { color: '#fff', fontWeight: '700' },
  btnModal: {
    backgroundColor: colors.light.primary,
    padding: 14,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: 12,
  },
  btnModalText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
