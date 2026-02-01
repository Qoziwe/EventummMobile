import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useUserStore } from '../store/userStore';

const { width } = Dimensions.get('window');

export default function TicketDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { user } = useUserStore();

  const { event } = route.params;
  // Ищем данные о билете в сторе пользователя
  const ticket = user.purchasedTickets.find(t => t.eventId === event.id);

  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Электронный билет</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ticketCard}>
          {/* Инфо о событии */}
          <View style={styles.eventInfoSection}>
            <Image
              source={
                !event.image || event.image === '' || typeof event.image !== 'string'
                  ? { uri: 'https://via.placeholder.com/800x450?text=Event' }
                  : { uri: event.image }
              }
              style={styles.eventImage}
            />
            <View style={styles.eventTextContent}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.infoRow}>
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={colors.light.primary}
                />
                <Text style={styles.infoText}>{event.date}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={colors.light.primary}
                />
                <Text style={styles.infoText} numberOfLines={1}>
                  {event.location}
                </Text>
              </View>
            </View>
          </View>

          {/* Разделительная линия (перфорация) */}
          <View style={styles.dividerContainer}>
            <View style={styles.circleLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.circleRight} />
          </View>

          {/* QR-код и детали билета */}
          <View style={styles.qrSection}>
            <Text style={styles.qrLabel}>Покажите этот код организатору</Text>

            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code" size={180} color={colors.light.foreground} />
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Билетов</Text>
                <Text style={styles.detailValue}>{ticket?.quantity || 1} шт.</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>ID Заказа</Text>
                <Text style={styles.detailValue}>
                  {ticket?.id.split('-')[1] || 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>АКТИВЕН</Text>
            </View>
          </View>
        </View>

        <View style={styles.instructions}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.light.mutedForeground}
          />
          <Text style={styles.instructionsText}>
            Билет действителен для однократного входа. Не показывайте QR-код посторонним
            лицам до мероприятия.
          </Text>
        </View>
      </ScrollView>
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
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  scrollContent: { padding: spacing.lg, alignItems: 'center' },
  ticketCard: {
    width: '100%',
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  eventInfoSection: { padding: spacing.lg, flexDirection: 'row', gap: spacing.md },
  eventImage: { width: 80, height: 80, borderRadius: borderRadius.lg },
  eventTextContent: { flex: 1, justifyContent: 'center', gap: 4 },
  eventTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.light.foreground,
    marginBottom: 4,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 13, color: colors.light.mutedForeground },

  dividerContainer: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  circleLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.light.background,
    marginLeft: -10,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  circleRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.light.background,
    marginRight: -10,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.light.border,
    marginHorizontal: 10,
  },

  qrSection: { padding: spacing.xl, alignItems: 'center' },
  qrLabel: {
    fontSize: 12,
    color: colors.light.mutedForeground,
    marginBottom: spacing.xl,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  qrPlaceholder: {
    padding: spacing.md,
    backgroundColor: '#fff',
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
  },
  detailsGrid: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.light.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  detailLabel: {
    fontSize: 10,
    color: colors.light.mutedForeground,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: { fontSize: 16, fontWeight: '700', color: colors.light.foreground },

  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#DCFCE7',
    borderRadius: borderRadius.full,
  },
  statusText: { color: '#166534', fontWeight: '800', fontSize: 12 },

  instructions: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  instructionsText: {
    flex: 1,
    fontSize: 12,
    color: colors.light.mutedForeground,
    lineHeight: 18,
  },
});
