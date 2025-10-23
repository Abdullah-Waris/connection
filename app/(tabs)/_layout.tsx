import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout(){
    return(
        <Tabs screenOptions={{tabBarActiveTintColor: "blue"}}>
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