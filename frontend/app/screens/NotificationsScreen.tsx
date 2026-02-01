import React, { useEffect } from 'react';
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
import { colors, spacing, borderRadius } from '../theme/colors';
import { useNotificationStore } from '../store/notificationStore';
import { useEventStore } from '../store/eventStore'; // Добавлен импорт

export default function NotificationsScreen() {
  const navigation = useNavigation<any>();
  const { notifications, fetchNotifications, markAsRead } = useNotificationStore();
  const { events } = useEventStore(); // Получаем события

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationPress = (notification: any) => {
    markAsRead(notification.id);
    if (notification.relatedId) {
      // Ищем полное событие по ID
      const targetEvent = events.find(e => e.id === notification.relatedId);

      if (targetEvent) {
        // Передаем полный объект события (EventDetail без 's')
        navigation.navigate('EventDetail', { ...targetEvent });
      } else {
        // Fallback если события нет в кэше
        navigation.navigate('EventDetail', { eventId: notification.relatedId });
      }
    }
  };

  const handleMarkAllRead = () => {
    markAsRead();
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.unreadNotification]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={item.type === 'new_event' ? 'calendar-outline' : 'notifications-outline'}
          size={24}
          color={colors.light.primary}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.content}>{item.content}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleString([], {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
      {!item.isRead && <View style={styles.dot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Уведомления</Text>
        <TouchableOpacity onPress={handleMarkAllRead}>
          <Ionicons
            name="checkmark-done-outline"
            size={24}
            color={colors.light.primary}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="notifications-off-outline"
              size={60}
              color={colors.light.mutedForeground}
            />
            <Text style={styles.emptyText}>У вас нет уведомлений</Text>
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.light.foreground },
  backButton: { padding: 4 },
  listContent: { padding: spacing.md },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  unreadNotification: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  contentContainer: { flex: 1 },
  content: {
    fontSize: 15,
    color: colors.light.foreground,
    marginBottom: 4,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: colors.light.mutedForeground,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.light.primary,
    marginLeft: spacing.sm,
    marginTop: 6,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    color: colors.light.mutedForeground,
    fontSize: 16,
  },
});
