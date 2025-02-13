import EventCard from "@/components/EventCard";
import StarryBackground from "@/components/StarryBackground";
import { useAttractionEventContext } from "@/context/AttractionEventContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";

const MyEventsScreen = () => {
	const { savedEvents } = useAttractionEventContext();

	return (
		<View style={{ flex: 1 }}>
			<StarryBackground />
			<SafeAreaView
				style={{
					alignItems: !savedEvents.length ? "center" : undefined,
					flex: 1,
					marginHorizontal: 20,
					justifyContent: !savedEvents.length ? "center" : undefined
				}}
			>
				{savedEvents.length ? (
					<>
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
					</>
				) : (
					<>
						<Text
							style={{
								fontSize: 20,
								fontWeight: "semibold",
								color: "white",
								marginBottom: 8
							}}
						>
							No saved events yet!
						</Text>
						<Text
							style={{
								fontSize: 20,
								fontWeight: "semibold",
								color: "white",
								marginBottom: 8,
								textAlign: "center"
							}}
						>
							Find events and tap the{" "}
							{
								<AntDesign
									name="hearto"
									style={{ color: "#F48FB1", fontSize: 20 }}
								/>
							}{" "}
							to add them here.
						</Text>
					</>
				)}
			</SafeAreaView>
		</View>
	);
};

export default MyEventsScreen;
