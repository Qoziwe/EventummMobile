import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, borderRadius, typography } from '../theme/colors';

interface EditProfileScreenProps {
  initialName?: string;
  initialBio?: string;
  initialEmail?: string;
  initialPhone?: string;
  initialLocation?: string;
  initialInterests?: string[];
}

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const params = route.params as EditProfileScreenProps | undefined;

  // --------------------
  // Состояние
  // --------------------
  const [name, setName] = useState(params?.initialName || 'Alex Johnson');
  const [username, setUsername] = useState('@alex_j');
  const [bio, setBio] = useState(params?.initialBio || 'Music lover, tech enthusiast.');
  const [email, setEmail] = useState(params?.initialEmail || 'alex@example.com');
  const [phone, setPhone] = useState(params?.initialPhone || '+7 700 123 45 67');
  const [location, setLocation] = useState(
    params?.initialLocation || 'Алматы, Казахстан'
  );
  const [interests, setInterests] = useState<string[]>(
    params?.initialInterests || ['Music', 'Technology']
  );

  // Скрываем нативный хедер
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // --------------------
  // Обработчики
  // --------------------
  const handleBackPress = () => navigation.goBack();

  const handleSave = () => {
    console.log('Saving profile data...');
    navigation.goBack();
  };

  const handleChangePhoto = () => Alert.alert('Фото', 'Открыть галерею...');
  const removeInterest = (item: string) =>
    setInterests(interests.filter(i => i !== item));
  const addInterest = () => Alert.alert('Интересы', 'Добавить тег...');

  const handleChangePassword = () => {
    Alert.alert('Смена пароля', 'Переход на экран смены пароля');
  };

  const handleLogout = () => {
    Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: () => console.log('Логика логаута'),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Удаление аккаунта',
      'Это действие необратимо. Все ваши данные будут стерты.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => console.log('Логика удаления'),
        },
      ]
    );
  };

  // --------------------
  // Рендер полей
  // --------------------
  const renderInput = (
    label: string,
    value: string,
    setValue: (text: string) => void,
    options: { multiline?: boolean; placeholder?: string; keyboardType?: any } = {}
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          options.multiline && styles.inputContainerMultiline,
        ]}
      >
        <TextInput
          style={[styles.input, options.multiline && styles.inputMultiline]}
          value={value}
          onChangeText={setValue}
          placeholder={options.placeholder}
          placeholderTextColor={colors.light.mutedForeground}
          multiline={options.multiline}
          textAlignVertical={options.multiline ? 'top' : 'center'}
          keyboardType={options.keyboardType || 'default'}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      {/* ХЕДЕР: Идентичный ProfileScreen */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Редактировать</Text>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          {/* Используем галочку вместо текста "Готово" для единого стиля */}
          <Ionicons name="checkmark" size={24} color={colors.light.primary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Фото */}
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarContainer} onPress={handleChangePhoto}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>AJ</Text>
                <View style={styles.cameraIconContainer}>
                  <Ionicons name="camera" size={14} color={colors.light.background} />
                </View>
              </View>
              <Text style={styles.changePhotoText}>Изменить фото</Text>
            </TouchableOpacity>
          </View>

          {/* Основная инфо */}
          <View style={styles.section}>
            {renderInput('Имя', name, setName)}
            {renderInput('Username', username, setUsername, { placeholder: '@username' })}
            {renderInput('О себе', bio, setBio, { multiline: true })}
          </View>

          {/* Контакты */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Контакты</Text>
            {renderInput('Email', email, setEmail, { keyboardType: 'email-address' })}
            {renderInput('Телефон', phone, setPhone, { keyboardType: 'phone-pad' })}
            {renderInput('Город', location, setLocation)}
          </View>

          {/* Интересы */}
          <View style={styles.section}>
            <View style={styles.interestsHeaderRow}>
              <Text style={styles.sectionHeader}>Интересы</Text>
              <TouchableOpacity onPress={addInterest}>
                <Text style={styles.addInterestText}>+ Добавить</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.interestsContainer}>
              {interests.map((item, index) => (
                <View key={index} style={styles.interestChip}>
                  <Text style={styles.interestText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeInterest(item)}>
                    <Ionicons
                      name="close-circle"
                      size={16}
                      color={colors.light.mutedForeground}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Безопасность и Аккаунт */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Безопасность</Text>

            <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
              <Text style={styles.actionButtonText}>Сменить пароль</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.light.mutedForeground}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Выйти из аккаунта</Text>
              <Ionicons name="log-out-outline" size={20} color={colors.light.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButtonContainer}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.deleteButtonText}>Удалить аккаунт</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  container: { flex: 1 },
  scrollContent: { paddingBottom: spacing['2xl'] },

  // --- ХЕДЕР (Стили идентичны ProfileScreen) ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    backgroundColor: colors.light.background,
  },
  backButton: {
    padding: spacing.xs,
  },
  saveButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
    textAlign: 'center',
  },

  // Аватар
  avatarSection: { alignItems: 'center', paddingVertical: spacing.xl },
  avatarContainer: { alignItems: 'center', gap: spacing.sm },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  avatarText: { fontSize: 32, fontWeight: '600', color: colors.light.foreground },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.light.primary,
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.light.background,
  },
  changePhotoText: {
    fontSize: typography.sm,
    color: colors.light.primary,
    fontWeight: '500',
  },

  // Секции
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
  sectionHeader: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.light.foreground,
    marginBottom: spacing.md,
  },

  // Инпуты
  inputGroup: { marginBottom: spacing.md },
  label: {
    fontSize: typography.xs,
    fontWeight: '500',
    color: colors.light.mutedForeground,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  inputContainer: {
    backgroundColor: colors.light.secondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputContainerMultiline: { height: 100, paddingVertical: spacing.sm },
  input: { fontSize: typography.base, color: colors.light.foreground },
  inputMultiline: { height: '100%' },

  // Интересы
  interestsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addInterestText: {
    fontSize: typography.sm,
    color: colors.light.primary,
    fontWeight: '500',
  },
  interestsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.light.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  interestText: { fontSize: typography.sm, color: colors.light.foreground },

  // --- Кнопки действий ---
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.light.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  actionButtonText: {
    fontSize: typography.base,
    color: colors.light.foreground,
    fontWeight: '500',
  },
  logoutText: {
    fontSize: typography.base,
    color: colors.light.primary,
    fontWeight: '500',
  },
  divider: {
    height: spacing.sm,
  },
  deleteButtonContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  deleteButtonText: {
    fontSize: typography.sm,
    color: '#FF3B30',
    fontWeight: '600',
  },

  bottomSpacer: { height: 40 },
});
