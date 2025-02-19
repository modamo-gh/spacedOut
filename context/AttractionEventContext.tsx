import { fetchAttractions, fetchEvents } from "@/services/ticketmaster";
import { Attraction } from "@/types/Attraction";
import { AttractionEventContextType } from "@/types/AttractionEventContext";
import { Event } from "@/types/Event";
import { Milestone } from "@/types/Milestone";
import { TimeUnit } from "@/types/TimeUnit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
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
		const { number, unit } = milestone.delta;

		const notificationID = await Notifications.scheduleNotificationAsync({
			content: {
				title: `Upcoming Event: ${event.name}`,
				body: `Your event is coming up in ${number} ${
					number === 1 ? unit.slice(0, -1) : unit
				}!`,
				data: { eventID: event.id, url: `/event/${event.id}` },
				interruptionLevel: "active"
			},
			trigger: {
				date: DateTime.fromISO(milestone.date).toJSDate(),
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

export const generateMilestones = (eventDate: string): Milestone[] => {
	const today = DateTime.now();
	const concertDate = DateTime.fromISO(eventDate);
	const milestoneDates: Milestone[] = [
		{ date: eventDate, delta: { unit: "days", number: 0 } }
	];

	if (!concertDate.isValid) {
		console.error("Invalid ISO date format:", eventDate);

		return [];
	}

	const generateDates = (timeUnit: TimeUnit, maxOfUnit: number) => {
		const timeObject: { [key: string]: number } = {};

		timeObject[timeUnit] = 1;

		while (
			concertDate.minus(timeObject) >= today &&
			timeObject[timeUnit] < maxOfUnit
		) {
			milestoneDates.push({
				date: concertDate.minus(timeObject).toISO(),
				delta: { number: timeObject[timeUnit], unit: timeUnit }
			});

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
	const [savedEventsHash, setSavedEventsHash] = useState<string | null>(null);

	useEffect(() => {
		const fetchStoredEvents = async () => {
			const storedEvents = await loadEventsFromStorage();

			setSavedEvents(storedEvents);
		};

		const loadHash = async () => {
			const storedHash = await AsyncStorage.getItem("savedEventsHash");

			if (storedHash) {
				setSavedEventsHash(storedHash);
			}
		};

		fetchStoredEvents();
		loadHash();
		registerForPushNotifications();
	}, []);

	useEffect(() => {
		if (!savedEvents || !savedEvents.length) {
			return;
		}

		const updateHash = async () => {
			const generateHash = async (data: string) => {
				return await Crypto.digestStringAsync(
					Crypto.CryptoDigestAlgorithm.MD5,
					data
				);
			};

			const newHash = await generateHash(JSON.stringify(savedEvents));

			if (newHash !== savedEventsHash) {
				await AsyncStorage.setItem("savedEventsHash", newHash);

				setSavedEventsHash(newHash);
			}
		};

		updateHash();
	}, [savedEvents]);

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
			].sort((a, b) => {
				const aMilestone = a.milestones[0] ? a.milestones[0].date : "";
				const bMilestone = b.milestones[0] ? b.milestones[0].date : "";

				const aMillis = aMilestone
					? DateTime.fromISO(aMilestone).toMillis()
					: Infinity;
				const bMillis = bMilestone
					? DateTime.fromISO(bMilestone).toMillis()
					: Infinity;

				return aMillis - bMillis;
			});

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

	const handleMilestoneTriggered = (id: string) => {
		setSavedEvents((prev) => {
			const event = prev.find((e) => e.id === id);

			if (!event) {
				return prev;
			}

			const remainingMilestones = event.milestones.slice(1);

			if (remainingMilestones.length === 0) {
				return prev.filter((e) => e.id !== id);
			} else {
				const updatedEvents = prev.map((e) =>
					e.id === id ? { ...e, milestones: remainingMilestones } : e
				);

				saveEventsToStorage(updatedEvents);

				return updatedEvents;
			}
		});
	};

	return (
		<AttractionEventContext.Provider
			value={{
				addEvent,
				attractions,
				getAttractions,
				getEvents,
				handleMilestoneTriggered,
				removeEvent,
				savedEvents,
				savedEventsHash,
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
