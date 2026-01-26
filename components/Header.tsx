'use client';

import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useUserStore } from '../store/userStore';

interface HeaderProps {
  showBack?: boolean;
  onBackPress?: () => void;
  title?: string;
  onProfilePress?: () => void;
}

const CITIES = [
  { id: '1', name: 'Астана' },
  { id: '2', name: 'Алматы' },
  { id: '3', name: 'Шымкент' },
  { id: '4', name: 'Актау' },
  { id: '5', name: 'Актобе' },
  { id: '6', name: 'Атырау' },
  { id: '7', name: 'Караганда' },
  { id: '8', name: 'Костанай' },
  { id: '9', name: 'Кызылорда' },
  { id: '10', name: 'Павлодар' },
  { id: '11', name: 'Петропавловск' },
  { id: '12', name: 'Семей' },
  { id: '13', name: 'Талдыкорган' },
  { id: '14', name: 'Тараз' },
  { id: '15', name: 'Уральск' },
  { id: '16', name: 'Усть-Каменогорск' },
  { id: '17', name: 'Экибастуз' },
];

export default function Header({
  showBack = false,
  onBackPress,
  title,
  onProfilePress,
}: HeaderProps) {
  const { user } = useUserStore();
  const [selectedCity, setSelectedCity] = useState('Алматы');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const dropdownRef = useRef<View>(null);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
  };

  const renderCityItem = ({ item }: { item: { id: string; name: string } }) => (
    <TouchableOpacity
      style={[styles.cityItem, selectedCity === item.name && styles.selectedCityItem]}
      onPress={() => handleCitySelect(item.name)}
      disabled={item.name !== 'Алматы'}
    >
      <View style={styles.cityItemContent}>
        <Text
          style={[
            styles.cityItemText,
            selectedCity === item.name && styles.selectedCityItemText,
            item.name !== 'Алматы' && styles.disabledCityText,
          ]}
        >
          {item.name}
        </Text>
        {item.name !== 'Алматы' && (
          <View style={styles.soonBadge}>
            <Text style={styles.soonText}>Скоро</Text>
          </View>
        )}
      </View>
      {selectedCity === item.name && (
        <Ionicons name="checkmark" size={18} color={colors.light.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.leftSection}>
            {showBack ? (
              <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.logoContainer}>
                <View style={styles.logoIcon}>
                  <Ionicons
                    name="flash"
                    size={20}
                    color={colors.light.primaryForeground}
                  />
                </View>
                <Text style={styles.logoText}>Eventum</Text>
              </TouchableOpacity>
            )}

            {title && <Text style={styles.headerTitle}>{title}</Text>}

            {!showBack && (
              <View ref={dropdownRef}>
                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={() => setShowCityDropdown(true)}
                >
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={colors.light.foreground}
                  />
                  <Text style={styles.locationText}>{selectedCity}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={colors.light.foreground}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.avatarButton} onPress={onProfilePress}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.avatarInitials}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <Modal
        visible={showCityDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCityDropdown(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCityDropdown(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownTitle}>Выберите город</Text>
                <FlatList
                  data={CITIES}
                  renderItem={renderCityItem}
                  keyExtractor={item => item.id}
                  showsVerticalScrollIndicator={false}
                  style={styles.cityList}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.light.background },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rightSection: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.light.foreground,
  },
  backButton: { padding: spacing.xs },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.light.secondary,
  },
  locationText: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colors.light.foreground,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButton: { marginLeft: spacing.xs },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.light.accentForeground,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 100,
    paddingHorizontal: spacing.lg,
  },
  dropdownContainer: {
    backgroundColor: colors.light.background,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownTitle: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.light.mutedForeground,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  cityList: { maxHeight: 300 },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    opacity: 0.7,
  },
  cityItemContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cityItemText: { fontSize: typography.base, color: colors.light.foreground },
  selectedCityItem: { backgroundColor: colors.light.secondary },
  selectedCityItemText: { fontWeight: '600', color: colors.light.primary },
  disabledCityText: { color: colors.light.mutedForeground },
  soonBadge: {
    backgroundColor: colors.light.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  soonText: {
    fontSize: typography.xs,
    color: colors.light.mutedForeground,
    fontWeight: '500',
  },
});
