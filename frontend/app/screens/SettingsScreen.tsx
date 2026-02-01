import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../theme/colors';

export default function SettingsScreen() {
  const navigation = useNavigation();

  const sections = [
    { id: 'acc', title: 'Аккаунт', icon: 'person-outline' },
    { id: 'notif', title: 'Уведомления', icon: 'notifications-outline' },
    { id: 'priv', title: 'Приватность', icon: 'lock-closed-outline' },
    { id: 'lang', title: 'Язык', icon: 'globe-outline' },
    { id: 'help', title: 'Помощь', icon: 'help-circle-outline' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Настройки</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {sections.map(s => (
          <TouchableOpacity key={s.id} style={styles.item}>
            <Ionicons name={s.icon as any} size={20} color={colors.light.primary} />
            <Text style={styles.itemText}>{s.title}</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.light.mutedForeground}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
    gap: 12,
  },
  itemText: { flex: 1, fontWeight: '600' },
});
