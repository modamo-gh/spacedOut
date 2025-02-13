import EventCard from "@/components/EventCard";
import StarryBackground from "@/components/StarryBackground";
import { useAttractionEventContext } from "@/context/AttractionEventContext";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { Image, SafeAreaView, Text, View } from "react-native";

const MyEventsScreen = () => {
	const { savedEvents } = useAttractionEventContext();

	return (
		<View style={{ flex: 1 }}>
			<StarryBackground />

			<SafeAreaView
				style={{
					flex: 1,
					marginHorizontal: 20
				}}
			>
				<Text
					style={{
						fontSize: 20,
						fontWeight: "semibold",
						color: "white",
						marginBottom: 8
					}}
				>
					Next Milestone
				</Text>
				<EventCard event={savedEvents[0]} isFeatured={true} />
				<Text
					style={{
						fontSize: 20,
						fontWeight: "semibold",
						color: "white",
						marginBottom: 8
					}}
				>
					Remaining Milestones
				</Text>
				<FlashList
					data={savedEvents.slice(1)}
					renderItem={({ item, index }) => (
						<EventCard event={item} isFeatured={false} />
					)}
				/>
			</SafeAreaView>
		</View>
	);
};

export default MyEventsScreen;
