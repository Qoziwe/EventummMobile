import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Screens
import HomeScreen from './screens/HomeScreen';
import AllEventsScreen from './screens/AllEventsScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import CommunitiesScreen from './screens/CommunitiesScreen';
import SearchScreen from './screens/SearchScreen';
import SettingsScreen from './screens/SettingsScreen';
import PostThreadScreen from './screens/PostThreadScreen'; // Добавляем импорт

// Icons component
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --------------------
// Компонент TabNavigator
// --------------------
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

// --------------------
// Стек для экрана профиля с настройками
// --------------------
function ProfileStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreenWrapper}
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
    </Stack.Navigator>
  );
}

// --------------------
// Обертка для ProfileScreen с передачей обработчиков
// --------------------
function ProfileScreenWrapper({ navigation }: any) {
  // --------------------
  // Обработчики для ProfileScreen
  // --------------------
  function openSettings() {
    navigation.navigate('Settings');
  }

  function handleSectionPress(sectionId: string) {
    if (sectionId === 'settings') {
      openSettings();
    }
    // Можно добавить обработку других секций здесь
  }

  function editProfile() {
    console.log('Редактирование профиля');
  }

  function becomeOrganizer() {
    console.log('Стать организатором');
  }

  function exploreEvents() {
    console.log('Поиск мероприятий');
  }

  function handleTabChange(tab: 'tickets' | 'favorites') {
    console.log('Смена таба на:', tab);
  }

  // --------------------
  // Данные для профиля
  // --------------------
  const userData = {
    avatarInitials: 'AJ',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'Пользователь',
    subscriptionType: 'Premium',
    bio: 'Music lover, tech enthusiast, always looking for the next great event.',
    eventsAttended: 24,
    eventsSaved: 12,
    communitiesJoined: 5,
    hasTickets: false,
  };

  // --------------------
  // Рендер ProfileScreen
  // --------------------
  return (
    <ProfileScreen
      avatarInitials={userData.avatarInitials}
      name={userData.name}
      email={userData.email}
      role={userData.role}
      subscriptionType={userData.subscriptionType}
      bio={userData.bio}
      eventsAttended={userData.eventsAttended}
      eventsSaved={userData.eventsSaved}
      communitiesJoined={userData.communitiesJoined}
      onSettings={openSettings}
      onEdit={editProfile}
      onBecomeOrganizer={becomeOrganizer}
      onExplore={exploreEvents}
      onSectionPress={handleSectionPress}
      onTabChange={handleTabChange}
      hasTickets={userData.hasTickets}
    />
  );
}

// --------------------
// Обертка для PostThreadScreen
// --------------------
function PostThreadScreenWrapper({ navigation, route }: any) {
  function handleBack() {
    navigation.goBack();
  }

  function handleSubmitComment(content: string, hasMedia: boolean, hasLink: boolean) {
    console.log('Новый комментарий:', content);
    // Логика отправки комментария на сервер
  }

  return (
    <PostThreadScreen
      postId={route.params?.postId}
      onBack={handleBack}
      onSubmitComment={handleSubmitComment}
    />
  );
}

// --------------------
// Основной компонент App
// --------------------
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="AllEvents" component={AllEventsScreen} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} />
          <Stack.Screen
            name="PostThread"
            component={PostThreadScreenWrapper}
            options={{
              headerShown: false,
              title: 'Обсуждение',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
