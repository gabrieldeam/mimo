import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { MimoProvider, useMimo } from './src/context/MimoContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/config/theme';

function AppContent() {
  const { isHydrated } = useMimo();
  if (!isHydrated) return <View style={{ flex: 1, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color={colors.green} /></View>;
  return <NavigationContainer><StatusBar style="dark" /><AppNavigator /></NavigationContainer>;
}

export default function App() { return <MimoProvider><AppContent /></MimoProvider>; }
