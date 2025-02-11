import { FlashList } from "@shopify/flash-list";
import * as Notifications from "expo-notifications";
import React from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import { useEventContext } from "@/context/EventContext";
import StarryBackground from "@/components/StarryBackground";

const MyEventsScreen = () => {
	const { savedEvents } = useEventContext();

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
			<View style={{ flex: 1 }}>
				<FlashList
					data={savedEvents}
					renderItem={({ item }) => (
						<View
							style={{
								backgroundColor: "#6600CC",
								borderRadius: 8,
								display: "flex",
								flexDirection: "row",
								height: 96,
								alignItems: "center",
								margin: 8,
								padding: 8
							}}
						>
							<Image
								source={{ uri: item.image }}
								style={{
									borderRadius: 8,
									height: 72,
									width: 72
								}}
							/>
							<View style={{ paddingLeft: 8 }}>
								<Text style={{ color: "white", width: "80%" }}>
									{item.name}
								</Text>
								<Text
									style={{
										color: "white",
										flexWrap: "wrap"
									}}
								>
									{item.date}
								</Text>
								<Text style={{ color: "white" }}>
									{item.location}
								</Text>
							</View>
						</View>
					)}
				/>
			</View>
		</View>
	);
};

export default MyEventsScreen;
