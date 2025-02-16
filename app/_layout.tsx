import { useColorScheme } from "@/components/useColorScheme";
import {
	AttractionEventProvider,
	useAttractionEventContext
} from "@/context/AttractionEventContext";
import {
	DarkTheme,
	DefaultTheme,
	NavigationContainerRef,
	ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { InteractionManager } from "react-native";
import "react-native-reanimated";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "(tabs)"
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		Geist: require("../assets/fonts/Geist-VariableFont_wght.ttf"),
		Orbitron: require("../assets/fonts/Orbitron-VariableFont_wght.ttf")
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<AttractionEventProvider>
			<RootLayoutNav />
		</AttractionEventProvider>
	);
}

function RootLayoutNav() {
	const { handleMilestoneTriggered } = useAttractionEventContext();
	const colorScheme = useColorScheme();
	const navigationRef = useRef<NavigationContainerRef<any>>(null);

	useEffect(() => {
		const subscription =
			Notifications.addNotificationResponseReceivedListener(
				(response) => {
					const { eventID, url } =
						response.notification.request.content.data;

					if (eventID) {
						handleMilestoneTriggered(eventID);

						if (navigationRef.current?.navigate) {
							navigationRef.current.navigate(url);
						}
					}
				}
			);

		return () => subscription.remove();
	}, []);

	return (
		<ThemeProvider
			value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			</Stack>
		</ThemeProvider>
	);
}
