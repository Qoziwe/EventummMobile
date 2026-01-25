import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useUserStore } from '../store/userStore';
import { useToast } from '../components/ToastProvider';
import { ALL_INTERESTS } from '../data/userMockData';

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
    interests: [...user.interests],
  });

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
          {/* Avatar Section */}
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

          {/* Form Fields */}
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

            {/* Interests Selection */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerButton: {
    padding: spacing.sm,
    minWidth: 60,
  },
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
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
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
  form: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.xs,
  },
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
  textArea: {
    minHeight: 100,
    paddingTop: spacing.md,
  },
  interestsSection: {
    marginTop: spacing.md,
  },
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
  interestTagText: {
    fontSize: typography.sm,
    color: colors.light.foreground,
  },
  interestTagTextActive: {
    color: colors.light.primaryForeground,
    fontWeight: '600',
  },
  deleteAccountButton: {
    marginTop: spacing['2xl'],
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  deleteAccountText: {
    color: '#EF4444',
    fontSize: typography.sm,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 40,
  },
});
