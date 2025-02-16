import BackButton from "@/components/BackButton";
import EventCard from "@/components/EventCard";
import StarryBackground from "@/components/StarryBackground";
import colors from "@/constants/Colors";
import { useAttractionEventContext } from "@/context/AttractionEventContext";
import { Event } from "@/types/Event";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
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
		const fetchEvents = async () => {
			setIsLoading(true);

			const fetchedEvents = await getEvents(attraction.id);

			setEvents(fetchedEvents || []);
			setIsLoading(false);
		};

		fetchEvents();
	}, [attraction.id, getEvents]);

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

	const eventContainerStyle = [
		styles.eventContainer,
		!events.length && styles.centered
	];

	return (
		<View style={styles.container}>
			<BackButton />
			<StarryBackground />
			<Animated.View
				style={[
					styles.heroHeight,
					styles.fullWidth,
					styles.imageContainer,
					animatedImageStyle
				]}
			>
				<Image
					cachePolicy="memory-disk"
					source={{
						uri: attraction.imageURL
					}}
					style={[styles.fullWidth, styles.image]}
				/>
			</Animated.View>
			<View style={styles.heroHeight} />
			{events.length ? (
				<Animated.ScrollView
					onScroll={scrollHandler}
					scrollEventThrottle={16}
					style={styles.container}
				>
					<View style={[styles.container, eventContainerStyle]}>
						{isLoading ? (
							<ActivityIndicator
								size="large"
								color={colors.textPrimary}
							/>
						) : (
							<FlashList
								data={events}
								estimatedItemSize={20}
								keyExtractor={(item) => item.id}
								renderItem={({ item }) => (
									<EventCard
										event={item}
										isFeatured={false}
										horizontalScroll={false}
									/>
								)}
							/>
						)}
					</View>
				</Animated.ScrollView>
			) : (
				<View style={[styles.container, eventContainerStyle]}>
					<Text style={styles.text}>
						Sorry, No Upcoming Events Found :/
					</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	centered: { alignItems: "center" },
	container: { flex: 1 },
	eventContainer: {
		height: screenHeight - HEADER_HEIGHT,
		gap: 8,
		justifyContent: "center",
		padding: 20,
		width: screenWidth
	},
	fullWidth: { width: "100%" },
	heroHeight: { height: HEADER_HEIGHT },
	image: { height: "100%" },
	imageContainer: {
		position: "absolute",
		resizeMode: "cover"
	},
	text: {
		color: colors.textPrimary,
		fontFamily: "Geist",
		fontSize: 16,
		fontWeight: "semibold",
		textAlign: "center"
	}
});

export default Attraction;
