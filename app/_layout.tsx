import { useColorScheme } from "@/components/useColorScheme";
import { AttractionEventProvider } from "@/context/AttractionEventContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
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
	const router = useRouter();

	const [loaded, error] = useFonts({
		Geist: require("../assets/fonts/Geist-VariableFont_wght.ttf"),
		Orbitron: require("../assets/fonts/Orbitron-VariableFont_wght.ttf")
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		const subscription =
			Notifications.addNotificationResponseReceivedListener(
				(response) => {
					const url = response.notification.request.content.data?.url;

					if (url) {
						router.push(url);
					}
				}
			);

		return () => subscription.remove();
	}, [router]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();

	return (
		<AttractionEventProvider>
			<ThemeProvider
				value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
			>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen
						name="(tabs)"
						options={{ headerShown: false }}
					/>
				</Stack>
			</ThemeProvider>
		</AttractionEventProvider>
	);
}
