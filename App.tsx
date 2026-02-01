import React, { useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Screens
import HomeScreen from './screens/HomeScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrganizerProfileScreen from './screens/OrganizerProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import CreateEventScreen from './screens/CreateEventScreen';
import CommunitiesScreen from './screens/DiscussionsScreen.tsx';
import MyDiscussionsScreen from './screens/MyDiscussionsScreen'; // ИМПОРТ НОВОГО ЭКРАНА
import SearchScreen from './screens/SearchScreen';
import SettingsScreen from './screens/SettingsScreen';
import PostThreadScreen from './screens/PostThreadScreen';
import { SubscriptionsScreen } from './screens/SubscriptionScreen';
import TicketDetailScreen from './screens/TicketDetailScreen';
import AuthScreen from './screens/AuthScreen';
import SavedEventsScreen from './screens/SavedEventsScreen';
import FollowedOrganizersScreen from './screens/FollowedOrganizersScreen';
import EditStudioScreen from './screens/EditStudioScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import FinanceScreen from './screens/FinanceScreen';
import CreateDiscussionScreen from './screens/CreateDiscussionScreen';
import NotificationsScreen from './screens/NotificationsScreen'; // Added Import

// Combined Toast System
import { ToastProvider } from './components/ToastProvider';

// Stores
import { useUserStore } from './store/userStore';
import { useEventStore } from './store/eventStore';
import { useDiscussionStore } from './store/discussionStore';

// Icons component
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  // Мы убрали локальный useSafeAreaInsets, так как теперь отступы обрабатываются глобально (снизу)
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Communities') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#eee',
          // Убираем дополнительный paddingBottom и height
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Поиск' }} />
      <Tab.Screen
        name="Communities"
        component={CommunitiesScreen}
        options={{ title: 'Сообщества' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{ title: 'Профиль' }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            navigation.navigate('Profile', { screen: 'ProfileMain' });
          },
        })}
      />
    </Tab.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreenWrapper} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Subscriptions" component={SubscriptionsScreen} />
      <Stack.Screen name="FollowedOrganizers" component={FollowedOrganizersScreen} />
      <Stack.Screen name="SavedEvents" component={SavedEventsScreen} />
      <Stack.Screen name="EditStudio" component={EditStudioScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
      <Stack.Screen name="Finance" component={FinanceScreen} />
      <Stack.Screen name="MyDiscussions" component={MyDiscussionsScreen} />
    </Stack.Navigator>
  );
}

function ProfileScreenWrapper() {
  const { user } = useUserStore();
  if (user.userType === 'organizer') {
    return <OrganizerProfileScreen />;
  }
  return <ProfileScreen />;
}

// Создаем внутренний компонент для логики приложения, чтобы использовать хук useSafeAreaInsets
function AppContent() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useUserStore();
  const fetchEvents = useEventStore(state => state.fetchEvents);
  const fetchPosts = useDiscussionStore(state => state.fetchPosts);
  const fetchMyTickets = useUserStore(state => state.fetchMyTickets);

  // Логика первичной загрузки данных из бэкенда Flask
  useEffect(() => {
    if (isAuthenticated) {
      // Оборачиваем в try-catch на случай если бэкенд не запущен
      const loadInitialData = async () => {
        try {
          await Promise.all([fetchEvents(), fetchPosts(), fetchMyTickets()]);
        } catch (e) {
          // initial load error
        }
      };
      loadInitialData();
    }
  }, [isAuthenticated]);

  return (
    <View
      style={{
        flex: 1,
        // Применяем отступы глобально, но НЕ сверху, чтобы не было белой полосы
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: '#fff',
      }}
    >
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <Stack.Screen name="Auth" component={AuthScreen} />
          ) : (
            <>
              <Stack.Screen name="MainTabs" component={TabNavigator} />
              <Stack.Screen name="EventDetail" component={EventDetailScreen} />
              <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
              <Stack.Screen name="OrganizerProfile" component={OrganizerProfileScreen} />
              <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
              <Stack.Screen name="PostThread" component={PostThreadScreen} />
              <Stack.Screen name="CreateDiscussion" component={CreateDiscussionScreen} />
              <Stack.Screen name="Notifications" component={NotificationsScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </SafeAreaProvider>
  );
}
