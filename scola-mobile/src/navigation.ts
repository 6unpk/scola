import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type TabParamList = {
  Home: undefined;
  Map: undefined;
  Search: undefined;
  Posts: undefined;
  My: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  Web: { path: string; title: string };
};

export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;
