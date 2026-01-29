import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal,
  FlatList,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useUserStore } from '../store/userStore';
import { useToast } from '../components/ToastProvider';
import { ALL_INTERESTS } from '../data/userMockData';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const DAYS = Array.from({ length: 31 }, (_, i) => ({
  id: `d${i + 1}`,
  label: `${i + 1}`,
  value: (i + 1).toString().padStart(2, '0'),
}));

const MONTHS = [
  { id: 'm0', label: 'Января', value: '01' },
  { id: 'm1', label: 'Февраля', value: '02' },
  { id: 'm2', label: 'Марта', value: '03' },
  { id: 'm3', label: 'Апреля', value: '04' },
  { id: 'm4', label: 'Мая', value: '05' },
  { id: 'm5', label: 'Июня', value: '06' },
  { id: 'm6', label: 'Июля', value: '07' },
  { id: 'm7', label: 'Августа', value: '08' },
  { id: 'm8', label: 'Сентября', value: '09' },
  { id: 'm9', label: 'Октября', value: '10' },
  { id: 'm10', label: 'Ноября', value: '11' },
  { id: 'm11', label: 'Декабря', value: '12' },
];

const YEARS = Array.from({ length: 80 }, (_, i) => {
  const year = 2024 - i;
  return { id: `y${year}`, label: `${year}`, value: `${year}` };
});

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, updateProfile } = useUserStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
    phone: user.phone,
    location: user.location,
    birthDate: user.birthDate || '',
    interests: [...user.interests],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selDay, setSelDay] = useState(
    user.birthDate ? user.birthDate.split('-')[2] : '01'
  );
  const [selMonth, setSelMonth] = useState(
    user.birthDate ? user.birthDate.split('-')[1] : '01'
  );
  const [selYear, setSelYear] = useState(
    user.birthDate ? user.birthDate.split('-')[0] : '2000'
  );
  const dateModalAnim = useRef(new Animated.Value(0)).current;

  const openDatePicker = () => {
    setShowDatePicker(true);
    Animated.timing(dateModalAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const closeDatePicker = () => {
    Animated.timing(dateModalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowDatePicker(false));
  };

  const handleConfirmDate = () => {
    setFormData({ ...formData, birthDate: `${selYear}-${selMonth}-${selDay}` });
    closeDatePicker();
  };

  const getDisplayDate = () => {
    if (!formData.birthDate || formData.birthDate === 'Invalid Date') return 'Не указана';
    const parts = formData.birthDate.split('-');
    if (parts.length !== 3) return 'Не указана';
    const [y, m, d] = parts;
    const monthLabel = MONTHS.find(mon => mon.value === m)?.label;
    return `${parseInt(d)} ${monthLabel} ${y}`;
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      showToast({ message: 'Имя не может быть пустым', type: 'error' });
      return;
    }
    updateProfile(formData);
    showToast({ message: 'Профиль успешно обновлен', type: 'success' });
    navigation.goBack();
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const renderDatePicker = () => {
    const backdropOpacity = dateModalAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    const cardTranslateY = dateModalAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [SCREEN_HEIGHT, 0],
    });

    return (
      <Modal
        visible={showDatePicker}
        transparent
        animationType="none"
        onRequestClose={closeDatePicker}
      >
        <View style={styles.modalRoot}>
          <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]}>
            <TouchableOpacity
              style={styles.flex}
              activeOpacity={1}
              onPress={closeDatePicker}
            />
          </Animated.View>
          <Animated.View
            style={[styles.modalCard, { transform: [{ translateY: cardTranslateY }] }]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Дата рождения</Text>
              <TouchableOpacity onPress={closeDatePicker}>
                <Ionicons name="close" size={28} color={colors.light.foreground} />
              </TouchableOpacity>
            </View>
            <View style={styles.datePickerContent}>
              <View style={styles.pickerCol}>
                <Text style={styles.colLabel}>День</Text>
                <FlatList
                  data={DAYS}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={i => i.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setSelDay(item.value)}
                      style={[
                        styles.pickerOpt,
                        item.value === selDay && styles.pickerOptActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerOptText,
                          item.value === selDay && styles.pickerOptTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
              <View style={[styles.pickerCol, { flex: 1.5 }]}>
                <Text style={styles.colLabel}>Месяц</Text>
                <FlatList
                  data={MONTHS}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={i => i.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setSelMonth(item.value)}
                      style={[
                        styles.pickerOpt,
                        item.value === selMonth && styles.pickerOptActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerOptText,
                          item.value === selMonth && styles.pickerOptTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
              <View style={styles.pickerCol}>
                <Text style={styles.colLabel}>Год</Text>
                <FlatList
                  data={YEARS}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={i => i.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setSelYear(item.value)}
                      style={[
                        styles.pickerOpt,
                        item.value === selYear && styles.pickerOptActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerOptText,
                          item.value === selYear && styles.pickerOptTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmDate}>
              <Text style={styles.confirmButtonText}>Подтвердить</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Редактировать</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Готово</Text>
        </TouchableOpacity>
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
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.avatarInitials}</Text>
              <TouchableOpacity style={styles.changePhotoButton}>
                <Ionicons
                  name="camera"
                  size={18}
                  color={colors.light.primaryForeground}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.changePhotoLabel}>Изменить фото</Text>
          </View>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Имя</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={text => setFormData({ ...formData, name: text })}
                placeholder="Ваше имя"
                placeholderTextColor={colors.light.mutedForeground}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Имя пользователя</Text>
              <TextInput
                style={styles.input}
                value={formData.username}
                onChangeText={text => setFormData({ ...formData, username: text })}
                placeholder="@username"
                autoCapitalize="none"
                placeholderTextColor={colors.light.mutedForeground}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>О себе</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.bio}
                onChangeText={text => setFormData({ ...formData, bio: text })}
                placeholder="Расскажите о себе"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={colors.light.mutedForeground}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Дата рождения</Text>
              <TouchableOpacity style={styles.dateSelector} onPress={openDatePicker}>
                <Text style={styles.dateSelectorText}>{getDisplayDate()}</Text>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={colors.light.primary}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Телефон</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={text => setFormData({ ...formData, phone: text })}
                placeholder="+7 (___) ___-__-__"
                keyboardType="phone-pad"
                placeholderTextColor={colors.light.mutedForeground}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Город</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={text => setFormData({ ...formData, location: text })}
                placeholder="Ваш город"
                placeholderTextColor={colors.light.mutedForeground}
              />
            </View>
            <View style={styles.interestsSection}>
              <Text style={styles.label}>Интересы</Text>
              <View style={styles.interestsGrid}>
                {ALL_INTERESTS.map(interest => {
                  const isSelected = formData.interests.includes(interest);
                  return (
                    <TouchableOpacity
                      key={interest}
                      style={[styles.interestTag, isSelected && styles.interestTagActive]}
                      onPress={() => toggleInterest(interest)}
                    >
                      <Text
                        style={[
                          styles.interestTagText,
                          isSelected && styles.interestTagTextActive,
                        ]}
                      >
                        {interest}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.deleteAccountButton}
            onPress={() => console.log('Delete account')}
          >
            <Text style={styles.deleteAccountText}>Удалить аккаунт</Text>
          </TouchableOpacity>
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
      {renderDatePicker()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: colors.light.background },
  flex: { flex: 1 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerButton: { padding: spacing.sm, minWidth: 60 },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  saveButtonText: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.light.primary,
    textAlign: 'right',
  },
  container: { flex: 1 },
  scrollContent: { padding: spacing.lg },
  avatarSection: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: typography['3xl'],
    fontWeight: '600',
    color: colors.light.foreground,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.light.primary,
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.light.background,
  },
  changePhotoLabel: {
    marginTop: spacing.sm,
    fontSize: typography.sm,
    color: colors.light.primary,
    fontWeight: '500',
  },
  form: { gap: spacing.lg },
  inputGroup: { gap: spacing.xs },
  label: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.light.foreground,
    marginLeft: 4,
  },
  input: {
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? spacing.md : spacing.sm,
    fontSize: typography.base,
    color: colors.light.foreground,
  },
  textArea: { minHeight: 100, paddingTop: spacing.md },
  dateSelector: {
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateSelectorText: { fontSize: typography.base, color: colors.light.foreground },
  interestsSection: { marginTop: spacing.md },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  interestTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  interestTagActive: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  interestTagText: { fontSize: typography.sm, color: colors.light.foreground },
  interestTagTextActive: { color: colors.light.primaryForeground, fontWeight: '600' },
  deleteAccountButton: {
    marginTop: spacing['2xl'],
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  deleteAccountText: { color: '#EF4444', fontSize: typography.sm, fontWeight: '500' },
  bottomSpacer: { height: 40 },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalCard: {
    backgroundColor: colors.light.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  modalTitle: { fontSize: 22, fontWeight: '800', color: colors.light.foreground },
  datePickerContent: { flexDirection: 'row', height: 200 },
  pickerCol: { flex: 1 },
  colLabel: {
    textAlign: 'center',
    fontSize: 10,
    color: colors.light.mutedForeground,
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  pickerOpt: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  pickerOptActive: { backgroundColor: colors.light.primary },
  pickerOptText: { fontSize: 15, color: colors.light.foreground },
  pickerOptTextActive: { color: '#fff', fontWeight: '700' },
  confirmButton: {
    backgroundColor: colors.light.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  confirmButtonText: { color: '#fff', fontSize: typography.base, fontWeight: '800' },
});
