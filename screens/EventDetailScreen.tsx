import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

export default function EventDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();

  // Данные приходят из навигации (это объект EventItem из mockData)
  const passedParams = route.params || {};

  // Дефолтные данные, если какое-то поле пустое в mockData
  const event = {
    title: 'Название события',
    date: 'Скоро',
    location: 'Место проведения',
    price: 'Бесплатно',
    category: 'Событие',
    description: 'Описание события скоро появится.',
    organizer: 'Организатор',
    timeRange: '19:00 - 22:00', // Можно добавить в mockData, если нужно
    tags: ['событие'],
    ...passedParams,
  };

  const imageSource =
    typeof event.image === 'string'
      ? { uri: event.image }
      : event.image || { uri: 'https://via.placeholder.com/400x200' };

  // Парсинг цены
  const numericPrice =
    typeof event.price === 'string'
      ? event.price.toLowerCase() === 'бесплатно'
        ? 0
        : parseInt(event.price.replace(/[^0-9]/g, '')) || 0
      : event.price;

  const [quantity, setQuantity] = useState(1);
  const totalPrice = numericPrice * quantity;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={imageSource} style={styles.eventImage} />

        <View style={styles.content}>
          <View style={styles.badges}>
            <View style={[styles.badge, styles.categoryBadge]}>
              <Text style={styles.categoryBadgeText}>{event.category}</Text>
            </View>
            <View style={[styles.badge, styles.outlineBadge]}>
              <Ionicons
                name="location-outline"
                size={12}
                color={colors.light.foreground}
              />
              <Text style={styles.outlineBadgeText}>{event.location}</Text>
            </View>
          </View>

          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.infoSection}>
            <InfoRow icon="calendar-outline" text={event.date} />
            <InfoRow icon="location-outline" text={event.location} />
            {event.timeRange && <InfoRow icon="time-outline" text={event.timeRange} />}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>О мероприятии</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Организатор</Text>
            <View style={styles.organizerRow}>
              <View style={styles.organizerAvatar}>
                <Text style={styles.avatarText}>{event.organizer?.[0] || 'O'}</Text>
              </View>
              <View style={styles.organizerInfo}>
                <Text style={styles.organizerName}>{event.organizer}</Text>
                <Text style={styles.organizerRole}>Организатор</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.purchaseSection}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>Цена билета</Text>
          <Text style={styles.priceValue}>{event.price}</Text>
        </View>

        <View style={styles.quantitySection}>
          <Text style={styles.quantityLabel}>Количество</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={() => quantity > 1 && setQuantity(q => q - 1)}
              style={styles.quantityButton}
            >
              <Ionicons name="remove" size={18} color={colors.light.foreground} />
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity(q => q + 1)}
              style={styles.quantityButton}
            >
              <Ionicons name="add" size={18} color={colors.light.foreground} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>
            {numericPrice === 0
              ? 'Зарегистрироваться'
              : `Купить за ${totalPrice.toLocaleString()} ₸`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function InfoRow({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={colors.light.mutedForeground} />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  header: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    position: 'absolute',
    top: 44,
    left: 0,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventImage: { width: '100%', height: 280 },
  content: { padding: spacing.lg, gap: spacing.lg },
  badges: { flexDirection: 'row', gap: spacing.sm },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  categoryBadge: { backgroundColor: `${colors.light.primary}20` },
  categoryBadgeText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.light.primary,
  },
  outlineBadge: { borderWidth: 1, borderColor: colors.light.border },
  outlineBadgeText: { fontSize: typography.xs, color: colors.light.foreground },
  title: {
    fontSize: typography['2xl'],
    fontWeight: '700',
    color: colors.light.foreground,
  },
  infoSection: { gap: spacing.sm },
  infoRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  infoText: { fontSize: typography.base, color: colors.light.mutedForeground },
  card: {
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  cardTitle: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.light.foreground,
    marginBottom: spacing.md,
  },
  description: { fontSize: typography.base, color: colors.light.mutedForeground },
  organizerRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  organizerAvatar: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: typography.xl, fontWeight: '600' },
  organizerInfo: { flex: 1 },
  organizerName: { fontSize: typography.lg, fontWeight: '600' },
  organizerRole: { fontSize: typography.sm, color: colors.light.mutedForeground },
  purchaseSection: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    backgroundColor: colors.light.card,
    gap: spacing.md,
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: { fontSize: typography.base, color: colors.light.mutedForeground },
  priceValue: { fontSize: typography.xl, fontWeight: '700' },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityLabel: { fontSize: typography.base },
  quantityControls: {
    flexDirection: 'row',
    backgroundColor: colors.light.muted,
    borderRadius: borderRadius.lg,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    fontSize: typography.lg,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
    paddingTop: 4,
  },
  buyButton: {
    backgroundColor: colors.light.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.light.primaryForeground,
  },
});
