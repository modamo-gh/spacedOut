import EventCard from "@/components/EventCard";
import StarryBackground from "@/components/StarryBackground";
import { useAttractionEventContext } from "@/context/AttractionEventContext";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { SafeAreaView, View } from "react-native";

const MyEventsScreen = () => {
	const { savedEvents } = useAttractionEventContext();

	return (
		<View style={{ flex: 1 }}>
			<StarryBackground />
			<SafeAreaView style={{ flex: 1 }}>
				<FlashList
					data={savedEvents}
					renderItem={({ item }) => <EventCard event={item} />}
				/>
			</SafeAreaView>
		</View>
	);
};

export default MyEventsScreen;
