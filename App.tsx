import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Screens
import HomeScreen from './screens/HomeScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrganizerProfileScreen from './screens/OrganizerProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import CreateEventScreen from './screens/CreateEventScreen'; // Добавлено
import CommunitiesScreen from './screens/CommunitiesScreen';
import SearchScreen from './screens/SearchScreen';
import SettingsScreen from './screens/SettingsScreen';
import PostThreadScreen from './screens/PostThreadScreen';
import { SubscriptionsScreen } from './screens/SubscriptionScreen';
import TicketDetailScreen from './screens/TicketDetailScreen';
import AuthScreen from './screens/AuthScreen';
import SavedEventsScreen from './screens/SavedEventsScreen';

// Combined Toast System
import { ToastProvider } from './components/ToastProvider';

// Stores
import { useUserStore } from './store/userStore';
import { useEventStore } from './store/eventStore'; // Добавлено для инициализации

// Icons component
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
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
      />
    </Tab.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreenWrapper}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Настройки',
          headerBackTitle: 'Назад',
        }}
      />
      <Stack.Screen
        name="Subscriptions"
        component={SubscriptionsScreen}
        options={{
          title: 'Подписки',
          headerBackTitle: 'Назад',
        }}
      />
      <Stack.Screen
        name="TicketDetail"
        component={TicketDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function ProfileScreenWrapper({ navigation }: any) {
  const { user } = useUserStore();

  function openSettings() {
    navigation.navigate('Settings');
  }

  function openSubscriptions() {
    navigation.navigate('Subscriptions');
  }

  function editProfile() {
    navigation.navigate('EditProfile', {
      initialName: user.name,
      initialBio: user.bio,
      initialEmail: user.email,
      initialPhone: user.phone,
      initialLocation: user.location,
      initialInterests: user.interests,
    });
  }

  function handleSectionPress(sectionId: string) {
    switch (sectionId) {
      case 'settings':
        openSettings();
        break;
      case 'subscriptions':
        openSubscriptions();
        break;
      default:
        console.log('Секция:', sectionId);
    }
  }

  if (user.userType === 'organizer') {
    return <OrganizerProfileScreen onSettings={openSettings} onEdit={editProfile} />;
  }

  return (
    <ProfileScreen
      onSettings={openSettings}
      onEdit={editProfile}
      onSectionPress={handleSectionPress}
      onSubscriptionPress={openSubscriptions}
    />
  );
}

function PostThreadScreenWrapper({ navigation, route }: any) {
  return (
    <PostThreadScreen
      postId={route.params?.postId}
      onBack={() => navigation.goBack()}
      onSubmitComment={content => console.log('Новый комментарий:', content)}
    />
  );
}

export default function App() {
  const { isAuthenticated } = useUserStore();

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
              <Stack.Screen name="Auth" component={AuthScreen} />
            ) : (
              <>
                <Stack.Screen name="MainTabs" component={TabNavigator} />
                <Stack.Screen
                  name="EventDetail"
                  component={EventDetailScreen}
                  options={{
                    headerShown: true,
                    title: 'Детали мероприятия',
                    headerBackTitle: 'Назад',
                  }}
                />
                <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
                <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
                <Stack.Screen
                  name="PostThread"
                  component={PostThreadScreenWrapper}
                  options={{
                    headerShown: true,
                    title: 'Обсуждение',
                    headerBackTitle: 'Назад',
                  }}
                />
                <Stack.Screen
                  name="SavedEvents"
                  component={SavedEventsScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="OrganizerProfile"
                  component={OrganizerProfileScreen}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
