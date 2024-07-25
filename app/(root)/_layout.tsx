import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import React from 'react';
import { SQLiteProvider } from 'expo-sqlite';

import { useSession } from '@/context/authContext';
import { Redirect, Stack, router } from 'expo-router';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { migrateDbIfNeeded } from '@/utils/Database';
import RevenueCatProvider from '@/providers/RevenueCat';

const AppLayout = () => {
  const { session } = useSession();

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <RevenueCatProvider>
      <SQLiteProvider databaseName="chat.db" onInit={migrateDbIfNeeded}>
        <Stack>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(modal)/settings"
            options={{
              presentation: 'modal',
              headerTitle: 'Settings',
              headerTitleAlign: 'center',
              headerShadowVisible: false,
              headerStyle: { backgroundColor: Colors.selected },
              headerRight: () =>
                router.canGoBack() && (
                  <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                      backgroundColor: Colors.greyLight,
                      borderRadius: 20,
                      padding: 6,
                    }}
                  >
                    <Ionicons
                      name="close-outline"
                      size={16}
                      color={Colors.grey}
                    />
                  </TouchableOpacity>
                ),
            }}
          />
          <Stack.Screen
            name="(modal)/purchases"
            options={{
              presentation: 'fullScreenModal',
              headerTitle: '',
              headerTitleAlign: 'center',
              headerShadowVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={{
                    borderRadius: 20,
                    padding: 6,
                  }}
                >
                  <Ionicons
                    name="close-outline"
                    size={28}
                    color={Colors.greyLight}
                  />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/Image/[url]"
            options={{
              presentation: 'fullScreenModal',
              headerTitle: '',
              headerBlurEffect: 'dark',
              headerTransparent: true,

              headerTitleAlign: 'center',
              headerShadowVisible: false,
              headerStyle: { backgroundColor: 'rgba(0,0,0,0.4)' },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={{
                    borderRadius: 20,
                    padding: 4,
                  }}
                >
                  <Ionicons name="close-outline" size={28} color={'#fff'} />
                </TouchableOpacity>
              ),
            }}
          />
        </Stack>
      </SQLiteProvider>
    </RevenueCatProvider>
  );
};

export default AppLayout;
