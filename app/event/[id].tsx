import BackButton from "@/components/BackButton";
import MapboxMap from "@/components/MapboxMap";
import { useAttractionEventContext } from "@/context/AttractionEventContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { DateTime } from "luxon";
import React from "react";
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

const EventDetailScreen = () => {
	const { id } = useLocalSearchParams();
	const { savedEvents } = useAttractionEventContext();

	const event = savedEvents.find((e) => e.id === id);

	if (!event) {
		return <Text>Event Not Found</Text>;
	}

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
			<Animated.Image
				source={{ uri: event.imageURL }}
				style={[styles.image, animatedImageStyle]}
			/>
			<Animated.ScrollView
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				style={{ flex: 1 }}
			>
				<View style={{ height: HEADER_HEIGHT }} />
				<View style={{ gap: 8, padding: 16 }}>
					<Text style={styles.name}>{event.name}</Text>
					<Text style={styles.text}>
						{DateTime.fromISO(event.dateTime).toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY
						)}
					</Text>
					<MapboxMap
						latitude={event.latitude}
						longitude={event.longitude}
					/>
					<View>
						<Text style={styles.text}>Next Milestone:</Text>
						<Text style={styles.text}>
							{DateTime.fromISO(
								event.milestones[0]
							).toLocaleString(
								DateTime.DATETIME_MED_WITH_WEEKDAY
							)}
						</Text>
					</View>
					<View>
						<Text style={styles.text}>Remaining Milestone:</Text>
						{event.milestones.map((milestone, index) => (
							<Text key={index} style={styles.text}>
								{DateTime.fromISO(milestone).toLocaleString(
									DateTime.DATETIME_MED_WITH_WEEKDAY
								)}
							</Text>
						))}
					</View>
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
export default EventDetailScreen;
