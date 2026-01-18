import { useState } from 'react';
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

// --------------------
// Типы
// --------------------
interface EventDetailParams {
  eventId: string;
  title: string;
  category: string;
  district: string;
  ageRestriction: string;
  dateFormatted: string;
  timeRange: string;
  venue: string;
  description: string;
  tags: string[];
  organizerName: string;
  organizerInitial: string;
  organizerRole: string;
  organizerEventsCount: string;
  organizerRating: string;
  price: number;
  availableTickets: number;
  totalCapacity: number;
  imageUri?: string;
}

interface EventDetailScreenProps {
  onBack?: () => void;
  onLikeToggle?: () => void;
  onShare?: () => void;
  onContact?: () => void;
  onQuantityDecrease?: () => void;
  onQuantityIncrease?: () => void;
  onBuy?: () => void;
}

export default function EventDetailScreen(props: EventDetailScreenProps) {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // --------------------
  // Состояние
  // --------------------
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // --------------------
  // Данные по умолчанию
  // --------------------
  const defaultEvent: EventDetailParams = {
    eventId: '1',
    title: 'Концерт группы "Звёзды"',
    category: 'Музыка',
    district: 'Центр',
    ageRestriction: '18+',
    dateFormatted: '15 февраля',
    timeRange: '20:00 - 23:00',
    venue: 'Клуб "Арена"',
    description:
      'Незабываемый концерт популярной группы "Звёзды". Приходите и наслаждайтесь музыкой!',
    tags: ['рок', 'концерт', 'живая музыка'],
    organizerName: 'EventPro',
    organizerInitial: 'E',
    organizerRole: 'Организатор мероприятий',
    organizerEventsCount: '25 мероприятий',
    organizerRating: '4.8',
    price: 500,
    availableTickets: 150,
    totalCapacity: 500,
    imageUri: 'https://via.placeholder.com/400x200',
  };

  // --------------------
  // Получаем данные события
  // --------------------
  const params = route.params as EventDetailParams | undefined;
  const event = params ? params : defaultEvent;

  // --------------------
  // Производные значения
  // --------------------
  const soldPercentage = Math.round(
    ((event.totalCapacity - event.availableTickets) / event.totalCapacity) * 100
  );

  const totalPrice = event.price * quantity;

  const isSoldOut = event.availableTickets === 0;
  const isMaxQuantity = quantity >= event.availableTickets;

  // --------------------
  // Обработчики
  // --------------------
  function goBack() {
    if (props.onBack) {
      props.onBack();
    } else {
      navigation.goBack();
    }
  }

  function toggleLike() {
    setIsLiked(!isLiked);

    if (props.onLikeToggle) {
      props.onLikeToggle();
    }
  }

  function decreaseQuantity() {
    if (quantity > 1) {
      setQuantity(quantity - 1);

      if (props.onQuantityDecrease) {
        props.onQuantityDecrease();
      }
    }
  }

  function increaseQuantity() {
    if (quantity < event.availableTickets) {
      setQuantity(quantity + 1);

      if (props.onQuantityIncrease) {
        props.onQuantityIncrease();
      }
    }
  }

  function buyTickets() {
    console.log(`Buying ${quantity} tickets for ${totalPrice} ₸`);

    if (props.onBuy) {
      props.onBuy();
    }
  }

  function contactOrganizer() {
    if (props.onContact) {
      props.onContact();
    }
  }

  function shareEvent() {
    if (props.onShare) {
      props.onShare();
    }
  }

  // --------------------
  // Рендер
  // --------------------
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={toggleLike} style={styles.headerButton}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={isLiked ? '#EF4444' : colors.light.foreground}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={shareEvent} style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color={colors.light.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <Image source={{ uri: event.imageUri }} style={styles.eventImage} />

        {/* Content */}
        <View style={styles.content}>
          {/* Badges */}
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
              <Text style={styles.outlineBadgeText}>{event.district}</Text>
            </View>

            <View style={[styles.badge, styles.outlineBadge]}>
              <Text style={styles.outlineBadgeText}>{event.ageRestriction}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{event.title}</Text>

          {/* Info */}
          <View style={styles.infoSection}>
            <InfoRow icon="calendar-outline" text={event.dateFormatted} />
            <InfoRow icon="time-outline" text={event.timeRange} />
            <InfoRow icon="location-outline" text={event.venue} />
          </View>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {event.tags.map(function (tag, index) {
              return (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              );
            })}
          </View>

          {/* Description */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>О мероприятии</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {/* Organizer */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Организатор</Text>

            <View style={styles.organizerRow}>
              <View style={styles.organizerAvatar}>
                <Text style={styles.avatarText}>{event.organizerInitial}</Text>
              </View>

              <View style={styles.organizerInfo}>
                <Text style={styles.organizerName}>{event.organizerName}</Text>
                <Text style={styles.organizerRole}>{event.organizerRole}</Text>
              </View>

              <TouchableOpacity onPress={contactOrganizer} style={styles.contactButton}>
                <Ionicons
                  name="chatbubble-outline"
                  size={16}
                  color={colors.light.foreground}
                />
                <Text style={styles.contactButtonText}>Связаться</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Purchase */}
      <View style={styles.purchaseSection}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>Цена билета</Text>
          <Text style={styles.priceValue}>
            {event.price === 0 ? 'Бесплатно' : `${event.price.toLocaleString()} ₸`}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${soldPercentage}%` }]} />
          </View>
          <Text style={styles.progressText}>{soldPercentage}% мест занято</Text>
        </View>

        <View style={styles.quantitySection}>
          <Text style={styles.quantityLabel}>Количество билетов</Text>

          <View style={styles.quantityControls}>
            <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
              <Ionicons name="remove" size={18} color={colors.light.foreground} />
            </TouchableOpacity>

            <Text style={styles.quantityValue}>{quantity}</Text>

            <TouchableOpacity
              onPress={increaseQuantity}
              style={styles.quantityButton}
              disabled={isMaxQuantity}
            >
              <Ionicons
                name="add"
                size={18}
                color={
                  isMaxQuantity ? colors.light.mutedForeground : colors.light.foreground
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={buyTickets}
          disabled={isSoldOut}
          style={[styles.buyButton, isSoldOut ? styles.buyButtonDisabled : null]}
        >
          <Ionicons
            name="card-outline"
            size={18}
            color={
              isSoldOut ? colors.light.mutedForeground : colors.light.primaryForeground
            }
          />

          <Text
            style={[
              styles.buyButtonText,
              isSoldOut ? styles.buyButtonTextDisabled : null,
            ]}
          >
            {isSoldOut
              ? 'Билеты распроданы'
              : `Купить за ${totalPrice.toLocaleString()} ₸`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --------------------
// Вспомогательный компонент
// --------------------
function InfoRow(props: { icon: any; text: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={props.icon} size={18} color={colors.light.mutedForeground} />
      <Text style={styles.infoText}>{props.text}</Text>
    </View>
  );
}

// --------------------
// Стили
// --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
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
  headerRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  eventImage: {
    width: '100%',
    height: 280,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  categoryBadge: {
    backgroundColor: `${colors.categories.music}33`,
  },
  categoryBadgeText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.categories.music,
  },
  outlineBadge: {
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  outlineBadgeText: {
    fontSize: typography.xs,
    color: colors.light.foreground,
  },
  title: {
    fontSize: typography['2xl'],
    fontWeight: '700',
    color: colors.light.foreground,
  },
  infoSection: {
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  infoText: {
    fontSize: typography.base,
    color: colors.light.mutedForeground,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.light.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  tagText: {
    fontSize: typography.xs,
    color: colors.light.mutedForeground,
  },
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
  description: {
    fontSize: typography.base,
    color: colors.light.mutedForeground,
  },
  organizerRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  organizerAvatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.xl,
    fontWeight: '600',
    color: colors.light.foreground,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.light.foreground,
  },
  organizerRole: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
  },
  contactButton: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.md,
  },
  contactButtonText: {
    fontSize: typography.sm,
    color: colors.light.foreground,
  },
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
  },
  priceLabel: {
    fontSize: typography.base,
    color: colors.light.mutedForeground,
  },
  priceValue: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  progressContainer: {
    gap: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.light.muted,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.light.accent,
  },
  progressText: {
    fontSize: typography.xs,
    color: colors.light.mutedForeground,
    textAlign: 'center',
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityControls: {
    flexDirection: 'row',
    backgroundColor: colors.light.muted,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
  },
  quantityButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    fontSize: typography.lg,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  buyButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.light.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  buyButtonDisabled: {
    backgroundColor: colors.light.muted,
  },
  buyButtonText: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.light.primaryForeground,
  },
  buyButtonTextDisabled: {
    color: colors.light.mutedForeground,
  },
});
