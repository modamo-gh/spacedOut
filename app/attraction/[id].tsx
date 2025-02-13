import BackButton from "@/components/BackButton";
import EventCard from "@/components/EventCard";
import { useAttractionEventContext } from "@/context/AttractionEventContext";
import { Event } from "@/types/Event";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	StyleSheet,
	Text,
	View
} from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue
} from "react-native-reanimated";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const HEADER_HEIGHT = screenHeight * 0.35;

const Attraction = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const { attractions, getEvents } = useAttractionEventContext();
	const { id } = useLocalSearchParams();
	const [isLoading, setIsLoading] = useState(true);

	const attraction = attractions.find((a) => a.id === id);

	if (!attraction) {
		return <Text>Attraction Not Found</Text>;
	}

	useEffect(() => {
		if (!events.length) {
			const fetchEvents = async () => {
				setIsLoading(true);

				const fetchedEvents = await getEvents(attraction.id);

				setEvents(fetchedEvents || []);
				setIsLoading(false);
			};

			fetchEvents();
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
			<BackButton />
			<Animated.View style={[styles.image, animatedImageStyle]}>
				<Image
					cachePolicy="memory-disk"
					source={{
						uri: attraction.imageURL
					}}
					style={{ width: "100%", height: "100%" }}
				/>
			</Animated.View>
			<Animated.ScrollView
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				style={{ flex: 1 }}
			>
				<View style={{ height: HEADER_HEIGHT }} />
				<View
					style={{
						alignItems: isLoading ? "center" : undefined,
						height: screenHeight - HEADER_HEIGHT,
						gap: 8,
						justifyContent:
							isLoading || !events.length
								? "center"
								: "flex-start",
						padding: 20,
						width: screenWidth
					}}
				>
					{isLoading ? (
						<ActivityIndicator size="large" color="#FFFFFF" />
					) : events.length ? (
						<FlashList
							data={events}
							estimatedItemSize={20}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => (
								<EventCard event={item} isFeatured={false} />
							)}
						/>
					) : (
						<Text
							style={{
								color: "white",
								fontSize: 16,
								fontWeight: "semibold",
								textAlign: "center"
							}}
						>
							Sorry, No Upcoming Events Found :/
						</Text>
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
