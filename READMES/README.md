# Eventum React Native App

This is a clean React Native UI design of the Eventum event discovery application. **No mock data, no placeholders** - just pure UI components ready for your data.

## Setup Instructions

### 1. Create a new Expo project

```bash
npx create-expo-app eventum-mobile --template blank-typescript
cd eventum-mobile
```

### 2. Install dependencies

```bash
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @expo/vector-icons
```

### 3. Copy the files

Copy all files from this `react-native` folder into your Expo project:

- Copy `App.tsx` to replace the default `App.tsx`
- Create `theme/` folder and add `colors.ts`
- Create `components/` folder and add all component files
- Create `screens/` folder and add all screen files

### 4. Run the app

```bash
npx expo start
```

## Project Structure

```
react-native/
├── App.tsx                     # Main app entry with navigation
├── theme/
│   └── colors.ts               # Design system colors & tokens
├── components/
│   ├── Header.tsx              # App header with search
│   ├── HeroSection.tsx         # Main hero with filters
│   ├── EventCard.tsx           # Reusable event card
│   ├── ForYouSection.tsx       # Events carousel section
│   ├── EventsGrid.tsx          # Popular events carousel
│   ├── CommunityPulse.tsx      # Communities section
│   └── Footer.tsx              # App footer
└── screens/
    ├── HomeScreen.tsx          # Main home screen
    ├── AllEventsScreen.tsx     # All events with filters
    ├── EventDetailScreen.tsx   # Event details & purchase
    ├── ProfileScreen.tsx       # User profile
    ├── CommunitiesScreen.tsx   # Communities list
    └── SearchScreen.tsx        # Search screen
```

## Usage - Passing Your Data

All components accept data via props. Example:

```tsx
// EventCard usage
<EventCard
  title="Jazz Night"
  date="Today, 20:00"
  venue="Blue Note Club"
  attendees={47}
  price="$35"
  category="Music"
  imageUri="https://your-image-url.com/image.jpg"
  onPress={() => navigation.navigate('EventDetail', { id: '1' })}
/>

// ForYouSection with children
<ForYouSection title="For You" subtitle="Based on your interests">
  {events.map(event => <EventCard key={event.id} {...event} />)}
</ForYouSection>

// ProfileScreen with data
<ProfileScreen
  avatarInitials="JD"
  name="John Doe"
  email="john@example.com"
  role="Explorer"
  interests={[{ id: 'music', label: 'Music', icon: '🎵' }]}
  stats={[{ icon: 'ticket-outline', value: '12', label: 'Tickets' }]}
/>
```

## What's Included (Pure UI)

- Home screen layout with sections
- All events screen with category chips
- Event detail screen with purchase section
- Profile screen with stats cards
- Communities screen with filters
- Search screen with quick filters

## What You Need to Add

- Your API/backend integration
- Authentication system
- Real data fetching (SWR, React Query, etc.)
- Navigation logic
- State management
- Push notifications
- Payment processing

## Customization

Edit `theme/colors.ts` to customize your design system.
