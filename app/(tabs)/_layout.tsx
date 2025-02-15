import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Link, Tabs } from "expo-router";

import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import colors from "@/constants/Colors";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
	name: React.ComponentProps<typeof Feather>["name"];
	color: string;
}) {
	return <Feather size={28} style={{ marginBottom: -16 }} {...props} />;
}

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			initialRouteName="findEvents"
			screenOptions={{
				tabBarActiveTintColor: colors.interactiveText,
				tabBarInactiveTintColor: colors.textSecondary,
				tabBarLabelStyle: {
					color: colors.interactiveText,
					fontSize: 14,
					padding: 16
				},
				tabBarStyle: {
					backgroundColor: colors.interactiveBackground,
					height: 108
				},
				// Disable the static render of the header on web
				// to prevent a hydration error in React Navigation v6.
				headerShown: useClientOnlyValue(false, true)
			}}
		>
			<Tabs.Screen
				name="findEvents"
				options={{
					header: () => null,
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="search" color={color} />
					),
					title: "Find Events"
				}}
			/>
			<Tabs.Screen
				name="myEvents"
				options={{
					header: () => null,
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="calendar" color={color} />
					),
					title: "My Events"
				}}
			/>
		</Tabs>
	);
}
