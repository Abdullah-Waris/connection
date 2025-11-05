import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, router } from 'expo-router';
import { Pressable, Text } from 'react-native'
import { useApp } from "../context/AppContext";


export default function TabLayout(){
    return(
        <Tabs
        screenOptions={{
            tabBarActiveTintColor: 'blue',
            headerRight: () =>
            __DEV__ ? (
                <Pressable onPress={() => router.push('/playground')} style={{ paddingRight: 12 }}>
                <Text>PG</Text>
                </Pressable>
            ) : null,
        }}
        >
            <Tabs.Screen
                name = "index"
                options = {{
                    title:"Today",
                    tabBarIcon: ({color}) => <FontAwesome size={28} name="home" color={color}/>
                }}
            />

            <Tabs.Screen
                name = "group"
                options = {{
                    title:"Group",
                    tabBarIcon: ({color}) => <FontAwesome size={28} name="group" color={color}/>
                }}
            />

            <Tabs.Screen
                name="archive"
                options={{
                    title: 'Archive',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="archive" color={color} />
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />
                }}
            />
        </Tabs>
    )
}