import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useDiscussionStore } from '../store/discussionStore';
import { useUserStore } from '../store/userStore';
import { useToast } from '../components/ToastProvider';
import { DISCUSSION_CATEGORIES } from '../data/discussionMockData';
import { calculateUserAge } from '../utils/dateUtils';
import { sanitizeText } from '../utils/security';

const AGE_LIMITS = [0, 6, 12, 16, 18];

export default function CreateDiscussionScreen() {
  const navigation = useNavigation<any>();
  const { addPost } = useDiscussionStore();
  const { user } = useUserStore();
  const { showToast } = useToast();

  const [content, setContent] = useState('');
  const [selectedCat, setSelectedCat] = useState(DISCUSSION_CATEGORIES[1]);
  const [ageLimit, setAgeLimit] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userAge = useMemo(() => calculateUserAge(user.birthDate), [user.birthDate]);

  const handlePublish = async () => {
    if (!content.trim()) {
      showToast({ message: 'Напишите что-нибудь...', type: 'error' });
      return;
    }

    if (content.trim().length < 10) {
      showToast({
        message: 'Слишком короткое сообщение (минимум 10 симв.)',
        type: 'info',
      });
      return;
    }

    if (ageLimit > userAge) {
      showToast({
        message: `Вы не можете создать обсуждение ${ageLimit}+, так как вам меньше лет`,
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const sanitizedContent = sanitizeText(content.trim());
      // Ожидаем завершения запроса
      await addPost({
        categorySlug: selectedCat.id,
        categoryName: selectedCat.label,
        authorId: user.id || 'anonymous',
        authorName: sanitizeText(user.name || 'Аноним'),
        content: sanitizedContent,
        ageLimit: ageLimit,
      });

      showToast({ message: 'Обсуждение создано!', type: 'success' });
      navigation.goBack();
    } catch (error: any) {
      showToast({
        message: error.message || 'Ошибка при создании обсуждения',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          <Ionicons name="close" size={28} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Новая тема</Text>
        <TouchableOpacity
          style={[
            styles.publishBtn,
            (!content.trim() || isSubmitting) && styles.publishBtnDisabled,
          ]}
          onPress={handlePublish}
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.publishBtnText}>Готово</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.scrollContent}>
            <Text style={styles.label}>Возрастное ограничение</Text>
            <View style={styles.ageContainer}>
              {AGE_LIMITS.map(age => (
                <TouchableOpacity
                  key={age}
                  style={[
                    styles.ageChip,
                    ageLimit === age && styles.ageChipActive,
                    age > userAge && styles.ageChipDisabled,
                  ]}
                  onPress={() => setAgeLimit(age)}
                  disabled={age > userAge || isSubmitting}
                >
                  <Text
                    style={[
                      styles.ageText,
                      ageLimit === age && styles.ageTextActive,
                      age > userAge && styles.ageTextDisabled,
                    ]}
                  >
                    {age === 0 ? 'Без огр.' : `${age}+`}
                  </Text>
                  {age > userAge && (
                    <Ionicons
                      name="lock-closed"
                      size={10}
                      color={colors.light.mutedForeground}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Выберите категорию</Text>
            <View style={styles.categoryGrid}>
              {DISCUSSION_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catCard,
                    selectedCat.id === cat.id && styles.catCardActive,
                  ]}
                  onPress={() => setSelectedCat(cat)}
                  disabled={isSubmitting}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={18}
                    color={
                      selectedCat.id === cat.id
                        ? colors.light.primary
                        : colors.light.mutedForeground
                    }
                  />
                  <Text
                    style={[
                      styles.catLabel,
                      selectedCat.id === cat.id && styles.catLabelActive,
                    ]}
                    numberOfLines={1}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.label}>Ваше сообщение</Text>
              <TextInput
                style={styles.textArea}
                placeholder="О чем вы хотите рассказать или что спросить?"
                placeholderTextColor={colors.light.mutedForeground}
                multiline
                textAlignVertical="top"
                value={content}
                onChangeText={setContent}
                maxLength={1000}
                editable={!isSubmitting}
              />
              <View style={styles.inputFooter}>
                <Text style={styles.infoSmall}>Минимум 10 символов</Text>
                <Text style={styles.charCount}>{content.length}/1000</Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.light.primary}
              />
              <Text style={styles.infoText}>
                Пользователи младше установленного возраста не увидят ваш пост.
              </Text>
            </View>
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: colors.light.background },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.light.foreground },
  publishBtn: {
    backgroundColor: colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.lg,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishBtnDisabled: { opacity: 0.5 },
  publishBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  container: { flex: 1 },
  scrollContent: { padding: spacing.lg },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.light.mutedForeground,
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 1,
  },
  ageContainer: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  ageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  ageChipActive: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  ageChipDisabled: { opacity: 0.5, backgroundColor: colors.light.secondary },
  ageText: { fontSize: 13, fontWeight: '700', color: colors.light.foreground },
  ageTextActive: { color: '#fff' },
  ageTextDisabled: { color: colors.light.mutedForeground },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  catCard: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  catCardActive: {
    borderColor: colors.light.primary,
    backgroundColor: `${colors.light.primary}05`,
  },
  catLabel: { fontSize: 13, fontWeight: '600', color: colors.light.foreground, flex: 1 },
  catLabelActive: { color: colors.light.primary },
  inputSection: { marginBottom: 20 },
  textArea: {
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    padding: 16,
    fontSize: 16,
    color: colors.light.foreground,
    minHeight: 180,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  infoSmall: { fontSize: 11, color: colors.light.mutedForeground },
  charCount: { fontSize: 11, color: colors.light.mutedForeground },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: `${colors.light.primary}08`,
    padding: 16,
    borderRadius: borderRadius.xl,
    gap: 12,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.light.primary,
    lineHeight: 18,
    fontWeight: '500',
  },
});
