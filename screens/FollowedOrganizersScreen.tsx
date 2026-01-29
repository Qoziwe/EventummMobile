import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';
import { useEventStore } from '../store/eventStore';
import { colors, spacing, borderRadius } from '../theme/colors';

export default function FollowedOrganizersScreen() {
  const navigation = useNavigation<any>();
  const { user, registeredUsers, toggleFollow } = useUserStore();
  const { events } = useEventStore();

  const followedOrganizers = useMemo(() => {
    const ids = user.followingOrganizerIds || [];
    return ids
      .map(id => {
        // Ищем в зарегистрированных
        const regUser = registeredUsers.find(u => u.id === id);
        if (regUser) return regUser;

        // Если нет, ищем в событиях (мок-авторы)
        const eventWithOrg = events.find(e => e.organizerId === id);
        if (eventWithOrg) {
          return {
            id: id,
            name: eventWithOrg.organizerName,
            avatarInitials: eventWithOrg.organizerName[0].toUpperCase(),
            location: 'Алматы',
          };
        }
        return null;
      })
      .filter(item => item !== null);
  }, [user.followingOrganizerIds, registeredUsers, events]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Мои авторы</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={followedOrganizers}
        keyExtractor={item => item!.id}
        contentContainerStyle={{ padding: spacing.lg }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('OrganizerProfile', { organizerId: item!.id })
            }
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item!.avatarInitials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item!.name}</Text>
              <Text style={styles.location}>{item!.location}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFollow(item!.id)}>
              <Text style={styles.unfollow}>Отписаться</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="people-outline"
              size={60}
              color={colors.light.mutedForeground}
            />
            <Text style={styles.emptyText}>Вы еще ни на кого не подписаны</Text>
          </View>
        }
      />
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.card,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.light.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: '700' },
  name: { fontWeight: '700', fontSize: 15 },
  location: { fontSize: 12, color: colors.light.mutedForeground },
  unfollow: { color: '#EF4444', fontWeight: '600', fontSize: 13 },
  empty: { flex: 1, alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 12, color: colors.light.mutedForeground },
});
