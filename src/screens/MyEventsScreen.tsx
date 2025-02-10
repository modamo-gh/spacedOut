import * as Notifications from "expo-notifications";
import { TouchableOpacity, View } from "react-native";

const MyEventsScreen = () => {
	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowAlert: true, // Ensures it shows as an alert
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
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center"
			}}
		>
			<TouchableOpacity
				style={{ backgroundColor: "purple", width: 96, height: 48 }}
				onPress={() => {
					scheduleNotification();
					debugScheduledNotifications();
				}}
			></TouchableOpacity>
		</View>
	);
};

export default MyEventsScreen;
