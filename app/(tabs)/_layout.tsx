import React from 'react';
import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon'; // Certifique-se de ajustar o caminho conforme necessário
import { Colors } from '@/constants/Colors'; // Certifique-se de ajustar o caminho conforme necessário
import { useColorScheme } from '@/hooks/useColorScheme'; // Certifique-se de ajustar o caminho conforme necessário

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel: false, // Oculta o nome da aba
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home-outline" color={color} /> // Ícone de casa não preenchido
          ),
        }}
      />
      <Tabs.Screen
        name="Favorites"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="heart-outline" color={color} /> // Ícone de coração não preenchido
          ),
        }}
      />
    </Tabs>
  );
}
