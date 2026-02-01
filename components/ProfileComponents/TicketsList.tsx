import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useEventStore } from '../../store/eventStore'; // Импортируем стор ивентов
import { useUserStore } from '../../store/userStore';
import EventCard from '../EventCard';
import { spacing, typography, colors, borderRadius } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function TicketsList() {
  const { user } = useUserStore();
  const { events } = useEventStore(); // Получаем динамический список всех событий
  const navigation = useNavigation<any>();

  if (user.purchasedTickets.length === 0) {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Ionicons
            name="ticket-outline"
            size={48}
            color={colors.light.mutedForeground}
          />
        </View>
        <Text style={styles.emptyTitle}>У вас пока нет билетов</Text>
        <Text style={styles.emptyDescription}>После покупки билеты появятся здесь</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user.purchasedTickets.map(ticket => {
        // Ищем мероприятие в актуальном сторе, а не в статичных данных
        const event = events.find(e => e.id === ticket.eventId);
        if (!event) return null;

        return (
          <View key={ticket.id} style={styles.ticketWrapper}>
            <EventCard
              {...event}
              style={styles.card}
              onPress={() => navigation.navigate('TicketDetail', { event })}
            />
            <View style={styles.ticketInfo}>
              <Ionicons name="qr-code-outline" size={16} color={colors.light.primary} />
              <Text style={styles.ticketQty}>Билетов: {ticket.quantity} шт.</Text>
              <Text style={styles.ticketDate}>
                Куплено: {new Date(ticket.purchaseDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
  },
  ticketWrapper: {
    marginBottom: spacing.lg,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  card: {
    width: '100%',
    marginBottom: 0,
    borderWidth: 0,
    borderRadius: 0,
  },
  ticketInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: `${colors.light.primary}05`,
    gap: spacing.sm,
  },
  ticketQty: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.light.foreground,
    flex: 1,
  },
  ticketDate: {
    fontSize: 10,
    color: colors.light.mutedForeground,
  },
  emptyState: { alignItems: 'center', padding: spacing['3xl'] },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.lg,
    fontWeight: '600',
    marginBottom: spacing.sm,
    color: colors.light.foreground,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
    textAlign: 'center',
  },
});
