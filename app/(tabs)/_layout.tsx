import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Text, View, Switch } from 'react-native';
import { useApp } from '../context/AppContext';

export default function TabLayout() {
  const { theme, setTheme } = useApp();
  const isDark = theme === 'dark';

  const palette = isDark
    ? {
        bg: '#0f172a',
        text: '#f8fafc',
        subtext: '#94a3b8',
        accent: '#f97316',
        border: 'rgba(248,250,252,0.08)',
      }
    : {
        bg: '#f9fafb',
        text: '#0f172a',
        subtext: '#64748b',
        accent: '#2563eb',
        border: 'rgba(15,23,42,0.08)',
      };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.accent,
        tabBarInactiveTintColor: palette.subtext,
        tabBarStyle: {
          backgroundColor: palette.bg,
          borderTopWidth: 1,
          borderTopColor: palette.border,
          height: 70,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: palette.bg,
        },
        headerTitleStyle: {
          color: palette.text,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <FontAwesome size={26} name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="group"
        options={{
          title: 'Group',
          tabBarIcon: ({ color }) => <FontAwesome size={26} name="group" color={color} />,
        }}
      />

      <Tabs.Screen
        name="archive"
        options={{
          title: 'Archive',
          tabBarIcon: ({ color }) => <FontAwesome size={26} name="archive" color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={26} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}