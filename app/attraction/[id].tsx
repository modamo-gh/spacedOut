import EventCard from "@/components/EventCard";
import { useAttractionEventContext } from "@/context/AttractionEventContext";
import { Event } from "@/types/Event";
import Feather from "@expo/vector-icons/Feather";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	Dimensions,
	Pressable,
	SafeAreaView,
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

const { height: screenHeight } = Dimensions.get("window");
const HEADER_HEIGHT = screenHeight * 0.35;

const Attraction = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const { attractions, getEvents } = useAttractionEventContext();
	const { id } = useLocalSearchParams();
	const router = useRouter();

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
			<Pressable
				onPress={() => router.back()}
				style={{
					alignItems: "center",
					borderRadius: 50,
					height: 48,
					width:48,
					justifyContent: "center",
					position: "absolute",
					top: 50,
					left: 20,
					backgroundColor: "rgba(34, 0, 102, 0.8)",
					zIndex: 10
				}}
			>
				<Feather
					name="chevron-left"
					style={{
						color: "white",
						fontSize: 30
					}}
				/>
			</Pressable>
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
				<View style={{ gap: 8, padding: 20 }}>
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
						<Text>No Upcoming Events</Text>
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
