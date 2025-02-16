import { fetchAttractions, fetchEvents } from "@/services/ticketmaster";
import { Attraction } from "@/types/Attraction";
import { Event } from "@/types/Event";
import { AttractionEventContextType } from "@/types/AttractionEventContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { DateTime } from "luxon";
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState
} from "react";

const STORAGE_KEY = "savedEvents";

const loadEventsFromStorage = async (): Promise<Event[]> => {
	try {
		const storedEvents = await AsyncStorage.getItem(STORAGE_KEY);

		return storedEvents ? JSON.parse(storedEvents) : [];
	} catch (error) {
		console.error("Error loading events from storage:", error);

		return [];
	}
};

const saveEventsToStorage = async (events: Event[]) => {
	try {
		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
	} catch (error) {
		console.error("Error saving events to storage:", error);
	}
};

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true
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

const checkPermissions = async () => {
	const { status, canAskAgain } = await Notifications.getPermissionsAsync();
	console.log("Notification Permissions:", { status, canAskAgain });
};

checkPermissions();

const debugScheduledNotifications = async () => {
	const scheduled = await Notifications.getAllScheduledNotificationsAsync();
	console.log("Scheduled Notifications:", scheduled);
};

debugScheduledNotifications();

const scheduleEventNotification = async (event: Event) => {
	if (!event.milestones.length) {
		return [];
	}

	const notificationIDs = [];

	for (const milestone of event.milestones) {
		const notificationID = await Notifications.scheduleNotificationAsync({
			content: {
				title: `Upcoming Event: ${event.name}`,
				body: "Your event is coming up!",
				data: {url: `/event/${event.id}`},
				interruptionLevel: "active"
			},
			trigger: {
				date: DateTime.fromISO(milestone).toJSDate(),
				type: Notifications.SchedulableTriggerInputTypes.DATE
			}
		});

		notificationIDs.push(notificationID);
	}

	return notificationIDs;
};

const AttractionEventContext = createContext<
	AttractionEventContextType | undefined
>(undefined);

export const generateMilestones = (eventDate: string): string[] => {
	const today = DateTime.now();
	const concertDate = DateTime.fromISO(eventDate);
	const milestoneDates = [eventDate];

	if (!concertDate.isValid) {
		console.error("Invalid ISO date format:", eventDate);

		return [];
	}

	const generateDates = (timeUnit: string, maxOfUnit: number) => {
		const timeObject: { [key: string]: number } = {};

		timeObject[timeUnit] = 1;

		while (
			concertDate.minus(timeObject) >= today &&
			timeObject[timeUnit] < maxOfUnit
		) {
			milestoneDates.push(concertDate.minus(timeObject).toISO());

			timeObject[timeUnit] *= 2;
		}
	};

	generateDates("days", 7);
	generateDates("weeks", 4);
	generateDates("months", 12);
	generateDates("years", Infinity);

	return milestoneDates.reverse();
};

export const AttractionEventProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [attractions, setAttractions] = useState<Attraction[]>([]);
	const [savedEvents, setSavedEvents] = useState<Event[]>([]);

	useEffect(() => {
		const fetchStoredEvents = async () => {
			const storedEvents = await loadEventsFromStorage();

			setSavedEvents(storedEvents);
		};

		fetchStoredEvents();
		registerForPushNotifications();
	}, []);

	const getAttractions = async (searchTerm: string) => {
		if (searchTerm.length) {
			const attractions = await fetchAttractions(searchTerm);

			if (!attractions) {
				return;
			}

			setAttractions(attractions);
		}
	};

	const getEvents = async (id: string) => {
		const events = await fetchEvents(id);

		return events;
	};

	const addEvent = useCallback(async (event: Event) => {
		const eventWithMilestones = {
			...event,
			milestones: generateMilestones(event.dateTime)
		};
		const notificationIDs = await scheduleEventNotification(
			eventWithMilestones
		);

		setSavedEvents((prev) => {
			const updatedEvents: Event[] = [
				...prev,
				{
					...event,
					notificationIDs: notificationIDs || []
				}
			].sort(
				(a, b) =>
					DateTime.fromISO(a.milestones[0]).toMillis() -
					DateTime.fromISO(b.milestones[0]).toMillis()
			);

			saveEventsToStorage(updatedEvents);

			return updatedEvents;
		});
	}, []);

	const removeEvent = useCallback(async (id: string) => {
		let eventToRemove: Event | undefined;

		setSavedEvents((prev) => {
			eventToRemove = prev.find((event) => event.id === id);
			const updatedEvents = prev.filter((event) => event.id !== id);

			saveEventsToStorage(updatedEvents);

			return updatedEvents;
		});

		if (eventToRemove?.notificationIDs.length) {
			for (const notificationID of eventToRemove.notificationIDs) {
				await Notifications.cancelScheduledNotificationAsync(
					notificationID
				);
			}
		}
	}, []);

	return (
		<AttractionEventContext.Provider
			value={{
				addEvent,
				attractions,
				getAttractions,
				getEvents,
				removeEvent,
				savedEvents,
				setAttractions
			}}
		>
			{children}
		</AttractionEventContext.Provider>
	);
};

export const useAttractionEventContext = () => {
	const context = useContext(AttractionEventContext);

	if (!context) {
		throw new Error(
			"useAttractionEventContext must be used within an EventProvider"
		);
	}
	return context;
};
