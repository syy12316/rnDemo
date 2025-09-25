import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index_all"
        options={{
          title:'All',
          tabBarItemStyle:{
            display:'none',
          }
        }}
        />
        <Tabs.Screen
          name="index_follow"
          options={{
            title:'Follow',
            tabBarItemStyle:{
              display:'none',
            }
          }}
         />
         <Tabs.Screen
          name='add'
          options={{
            title:'Add',
            tabBarIcon:({color}) => (
              <View className='w-14 h-10 mt-3 flex items-center justify-center bg-myGreen rounded-xl'>
                <Text className='text-myWhite text-3xl'>+</Text>
              </View>
            ),
            tabBarLabelStyle:{
              display:'none'
            }
          }}
         />
         <Tabs.Screen 
          name='profile'
          options={{
            title:'Profile',
            tabBarIcon:({color}) => <IconSymbol size={28} color={color} name='person.fill'/> 
          }}
          />
         
    </Tabs>
  );
}