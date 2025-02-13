import EventCard from "@/components/EventCard";
import { useAttractionEventContext } from "@/context/AttractionEventContext";
import { Event } from "@/types/Event";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue
} from "react-native-reanimated";

const { height: screenHeight } = Dimensions.get("window");
const HEADER_HEIGHT = screenHeight * 0.4;

const Attraction = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const { attractions, getEvents } = useAttractionEventContext();
	const { id } = useLocalSearchParams();

	const attraction = attractions.find((a) => a.id === id);

	if (!attraction) {
		return <Text>Attraction Not Found</Text>;
	}

	useEffect(() => {
		if (attraction) {
			getEvents(attraction.id).then(setEvents);
		}
	}, [attraction, getEvents]);

	const scrollY = useSharedValue(0);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (e) => {
			scrollY.value = e.contentOffset.y;
		}
	});

	const animatedImageStyle = useAnimatedStyle(() => {
		return {
			height: interpolate(
				scrollY.value,
				[0, HEADER_HEIGHT],
				[HEADER_HEIGHT, 0],
				Extrapolation.CLAMP
			)
		};
	});

	return (
		<View style={{ backgroundColor: "#220066", flex: 1 }}>
			<Animated.Image
				source={{
					uri: attraction.imageURL
				}}
				style={[styles.image, animatedImageStyle]}
			/>
			<Animated.ScrollView
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				style={{ flex: 1 }}
			>
				<View style={{ height: HEADER_HEIGHT }} />
				<View style={{ gap: 8, padding: 16 }}>
					<Text style={styles.name}>{attraction.name}</Text>
					<Text style={styles.name}>Upcoming Events</Text>
					{events.length ? (
						<FlashList
							data={events}
							estimatedItemSize={20}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => (
								<EventCard event={item} />
							)}
						/>
					) : (
						<Text> No Upcoming Events</Text>
					)}
				</View>
			</Animated.ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	image: {
		height: HEADER_HEIGHT,
		position: "absolute",
		resizeMode: "cover",
		width: "100%"
	},
	name: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white"
	},
	text: {
		fontSize: 16,
		fontWeight: "semibold",
		color: "white"
	}
});
export default Attraction;
