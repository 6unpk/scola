import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import WebScreen from './src/screens/WebScreen';
import WebTabScreen from './src/screens/WebTabScreen';
import { colors } from './src/config';
import type { RootStackParamList, TabParamList } from './src/navigation';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TABS: { name: keyof TabParamList; label: string; icon: keyof typeof Ionicons.glyphMap; path?: string }[] = [
  { name: 'Home', label: '홈', icon: 'home' },
  { name: 'Map', label: '지도', icon: 'map', path: '/map' },
  { name: 'Search', label: '검색', icon: 'search', path: '/search' },
  { name: 'Posts', label: '매거진', icon: 'book', path: '/posts' },
  { name: 'My', label: '내 정보', icon: 'person', path: '/mypage' },
];

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray500,
        tabBarStyle: { borderTopColor: colors.gray200 },
      }}
    >
      {TABS.map((t) => (
        <Tab.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.label,
            tabBarIcon: ({ color, size }) => <Ionicons name={t.icon} size={size} color={color} />,
          }}
        >
          {() => (t.path ? <WebTabScreen path={t.path} /> : <HomeScreen />)}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator>
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen
            name="Web"
            options={({ route }) => ({ title: route.params.title, headerTintColor: colors.primary, headerBackTitle: '뒤로' })}
          >
            {({ route }) => <WebScreen path={route.params.path} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
