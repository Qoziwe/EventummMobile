import type React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = 280;

interface Event {
  id: string;
  title: string;
  image: any;
  date: string;
  location: string;
  price: string;
  isPaid: boolean;
  isPromoted: boolean;
}

interface CustomPeriodFeedProps {
  events: Event[];
  dateRangeLabel?: string;
}

export const CustomPeriodFeed: React.FC<CustomPeriodFeedProps> = ({
  events,
  dateRangeLabel = 'Выбранный период',
}) => {
  const renderEventCard = ({ item }: { item: Event }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.cardContainer}>
      <View style={styles.card}>
        <Image
          source={
            !item.image || item.image === ''
              ? { uri: 'https://via.placeholder.com/800x450?text=Event' }
              : typeof item.image === 'string'
                ? { uri: item.image }
                : item.image
          }
          style={styles.cardImage}
        />
        <View style={styles.badgesContainer}>
          {item.isPromoted && (
            <View style={styles.promotedBadge}>
              <Text style={styles.promotedText}>Featured</Text>
            </View>
          )}
        </View>
        <View style={styles.gradient} />
        <View style={styles.contentContainer}>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.date} numberOfLines={1}>
            {item.date}
          </Text>
          <Text style={styles.location} numberOfLines={1}>
            📍 {item.location}
          </Text>
          <View style={styles.footerContainer}>
            <View>
              <Text style={styles.priceLabel}>From</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
            <TouchableOpacity style={styles.notifyButton}>
              <Text style={styles.notifyButtonText}>Notify Me</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.sectionTitle}>Пользовательский период</Text>
      <Text style={styles.sectionSubtitle}>{dateRangeLabel}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderSectionHeader()}
      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        snapToInterval={CARD_WIDTH + 12}
        decelerationRate="fast"
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  listContentContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  cardContainer: {
    width: CARD_WIDTH,
  },
  card: {
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  badgesContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
  },
  promotedBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  promotedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    zIndex: 1,
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
    backdropFilter: 'blur(10px)',
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
  },
  notifyButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  notifyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
});
