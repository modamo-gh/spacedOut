import EventCard from "@/components/EventCard";
import StarryBackground from "@/components/StarryBackground";
import { useEventContext } from "@/context/EventContext";
import { FlashList } from "@shopify/flash-list";
import * as Notifications from "expo-notifications";
import React from "react";
import { SafeAreaView, View } from "react-native";

const MyEventsScreen = () => {
	const { savedEvents } = useEventContext()

	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowAlert: true,
			shouldPlaySound: true,
			shouldSetBadge: false
		})
	});

	const registerForPushNotifications = async () => {
		const { status: existingStatus } =
			await Notifications.requestPermissionsAsync();
		let finalStatus = existingStatus;

		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
	};

	registerForPushNotifications();

	const checkPermissions = async () => {
		const { status, canAskAgain } =
			await Notifications.getPermissionsAsync();
		console.log("Notification Permissions:", { status, canAskAgain });
	};

	checkPermissions();

	const debugScheduledNotifications = async () => {
		const scheduled =
			await Notifications.getAllScheduledNotificationsAsync();
		console.log("Scheduled Notifications:", scheduled);
	};

	debugScheduledNotifications();

	const scheduleNotification = async () => {
		await Notifications.scheduleNotificationAsync({
			content: {
				title: "You've got mail! 📬",
				body: "Here is the notification body",
				data: { data: "goes here", test: { test1: "more data" } },
				interruptionLevel: "active"
			},
			trigger: null
		});

		console.log("Notification scheduled!");
	};

	return (
		<View style={{ flex: 1 }}>
			<StarryBackground />
			<SafeAreaView style={{ flex: 1 }}>
				<FlashList
					data={savedEvents}
					renderItem={({ item }) => <EventCard event={item} />}
				/>
			</SafeAreaView>
		</View>
	);
};

export default MyEventsScreen;
