import colors from "@/constants/Colors";
import fontSizes from "@/constants/fontSizes";
import { Event } from "@/types/Event";
import { EventsSectionProps } from "@/types/EventsSectionProps";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import EventCard from "./EventCard";

const EventsSection: React.FC<EventsSectionProps> = ({
	isLoadingSectionEvents,
	sectionEvents,
	sectionName
}) => {
	const getEventDisplayComponent = () => {
		if (!sectionEvents || !sectionEvents.length) {
			return (
				<Text style={styles.noEventsText}>No {sectionName} Found</Text>
			);
		}

		if (sectionEvents.length === 1) {
			return (
				<EventCard
					event={sectionEvents[0]}
					isFeatured={true}
					horizontalScroll={false}
				/>
			);
		}
		return (
			<FlashList
				data={sectionEvents}
				estimatedItemSize={20}
				horizontal
				keyExtractor={({ id }) => id}
				renderItem={({ item }) => (
					<EventCard
						event={item}
						isFeatured={false}
						horizontalScroll
					/>
				)}
			/>
		);
	};

	return (
		<View>
			<Text style={[styles.text, styles.sectionHeader]}>
				{sectionName.toLocaleUpperCase()}
			</Text>
			<View style={styles.sectionContainer}>
				{isLoadingSectionEvents ? (
					<ActivityIndicator
						size="large"
						color={colors.textPrimary}
					/>
				) : (
					getEventDisplayComponent()
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	noEventsText: {
		color: colors.textPrimary,
		fontFamily: "Geist",
		fontSize: fontSizes.default
	},
	sectionContainer: {
		alignItems: "center",
		height: 224,
		justifyContent: "center",
		marginBottom: 12
	},
	sectionHeader: {
		fontFamily: "Geist",
		fontSize: fontSizes.large,
		fontWeight: "semibold",
		marginBottom: 12
	},
	text: { color: colors.textPrimary }
});

export default EventsSection;
