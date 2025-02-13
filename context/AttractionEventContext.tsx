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
		console.log("Error loading events from storage:", error);

		return [];
	}
};

const saveEventsToStorage = async (events: Event[]) => {
	try {
		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
	} catch (error) {
		console.log("Error saving events to storage:", error);
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
	const nextMilestone = event.milestones[0];

	if (!nextMilestone) {
		return;
	}

	await Notifications.scheduleNotificationAsync({
		content: {
			title: `Upcoming Event: ${event.name}`,
			body: "Your event is coming up!",
			data: { eventID: event.id },
			interruptionLevel: "active"
		},
		trigger: {
			date: DateTime.fromISO(nextMilestone).toJSDate(),
			type: Notifications.SchedulableTriggerInputTypes.DATE
		}
	});
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
		const attractions = await fetchAttractions(searchTerm);

		if (!attractions) {
			return;
		}

		setAttractions(attractions);
	};

	const getEvents = async (id: string) => {
		const events = await fetchEvents(id);

		return events;
	};

	const addEvent = useCallback((event: Event) => {
		setSavedEvents((prev) => {
			const updatedEvents = [
				...prev,
				{ ...event, milestones: generateMilestones(event.dateTime) }
			].sort(
				(a, b) =>
					DateTime.fromISO(a.milestones[0]).toMillis() -
					DateTime.fromISO(b.milestones[0]).toMillis()
			);

			saveEventsToStorage(updatedEvents);
			scheduleEventNotification(event);

			return updatedEvents;
		});
	}, []);

	const removeEvent = useCallback((id: string) => {
		setSavedEvents((prev) => {
			const updatedEvents = prev.filter((event) => event.id !== id);

			saveEventsToStorage(updatedEvents);

			return updatedEvents;
		});
	}, []);

	return (
		<AttractionEventContext.Provider
			value={{
				addEvent,
				attractions,
				getAttractions,
				getEvents,
				removeEvent,
				savedEvents
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
