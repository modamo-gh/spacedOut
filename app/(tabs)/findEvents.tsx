import { FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import { DateTime } from "luxon";
import React, { useState } from "react";
import {
	FlatList,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getEvents, getSuggestions } from "../../services/ticketmaster";
import { useEventContext } from "@/context/EventContext";
import StarryBackground from "@/components/StarryBackground";
import AttractionCard from "@/components/AttractionCard";
import { Attraction } from "@/types/Attraction";

const FindEventsScreen = () => {
	const [date, setDate] = useState<Date>();
	const [events, setEvents] = useState<any[]>([]);
	const [ids, setIDs] = useState<Set<string>>(new Set());
	const [milestones, setMilestones] = useState<string[]>([]);
	const [searchResults, setSearchResults] = useState<Attraction[]>([]);
	const [selectedID, setSelectedID] = useState("");
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [text, setText] = useState("");

	const { addEvent } = useEventContext();
	const today = new Date();

	const [fontsLoaded] = useFonts({
		Orbitron: require("../../assets/fonts/Orbitron-VariableFont_wght.ttf")
	});

	const handleConfirm = (date: Date) => {
		setDate(date);

		const concertDate = DateTime.fromJSDate(date);
		const t = DateTime.fromJSDate(today);

		const milestoneDates = [concertDate.toLocaleString(DateTime.DATE_FULL)];

		const generateDates = (timeUnit: string, maxOfUnit: number) => {
			const timeObject: { [key: string]: number } = {};

			timeObject[timeUnit] = 1;

			while (
				concertDate.minus(timeObject) >= t &&
				timeObject[timeUnit] < maxOfUnit
			) {
				milestoneDates.push(
					concertDate
						.minus(timeObject)
						.toLocaleString(DateTime.DATE_FULL)
				);

				timeObject[timeUnit] *= 2;
			}
		};

		generateDates("days", 7);
		generateDates("weeks", 4);
		generateDates("months", 12);
		generateDates("years", Infinity);

		setMilestones(milestoneDates.reverse());
		setShowDatePicker(false);
	};

	const getEventResults = async (id: string) => {
		const e = await getEvents(id);

		setEvents((prev) => {
			const newResults = [];
			const updatedIDs = new Set<string>();

			for (const ev of e) {
				if (!updatedIDs.has(ev.id)) {
					updatedIDs.add(ev.id);
					newResults.push(ev);
				}
			}

			setIDs(new Set(updatedIDs));

			return [...prev, ...newResults];
		});
	};

	const getSearchResults = async (searchTerm: string) => {
		const searchResults = await getSuggestions(searchTerm);

		setSearchResults(searchResults);
	};

	if (!fontsLoaded) {
		return null;
	}

	return (
		<View style={{ flex: 1 }}>
			<StarryBackground />
			<SafeAreaView
				style={{
					display: "flex",
					flex: 1,
					flexDirection: "column"
				}}
			>
				<TextInput
					autoCapitalize="none"
					autoCorrect={false}
					onChangeText={setText}
					onSubmitEditing={() => {
						setEvents([]);
						getSearchResults(text.trim());
					}}
					style={styles.textInput}
					value={text}
				/>
				<View style={{ flex: 1 }}>
					<FlashList
						data={events.length ? events : searchResults}
						estimatedItemSize={10}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) =>
							item.type === "attraction" ? (
								<AttractionCard attraction={item} />
							) : null
						}
					/>
				</View>
				{/* <View
					style={{
						flex: 4,
						alignItems: "stretch",
						justifyContent: "center"
					}}
				>
					<View
						style={{
							flex: 1,
							alignItems: "center",
							justifyContent: "center"
						}}
					>
						<Text style={[styles.text, styles.labelText]}>
							Today
						</Text>
						<Text style={[styles.text, styles.labelText]}>
							{today.toDateString()}
						</Text>
					</View>
					<View style={{ flex: 8 }}>
						<FlatList
							contentContainerStyle={{
								flex: 3,
								justifyContent: "space-around",
								alignItems: "center",
								width: screenWidth
							}}
							data={milestones}
							keyExtractor={(item) => item}
							renderItem={(item) => (
								<Text style={[styles.text, styles.dateText]}>
									{item.item}
								</Text>
							)}
							style={{ flex: 4 }}
						/>
					</View>
					<View
						style={{
							flex: 1,
							alignItems: "center",
							justifyContent: "center"
						}}
					>
						<Text style={[styles.text, styles.labelText]}>
							Target
						</Text>
						{date ? (
							<Text style={[styles.text, styles.labelText]}>
								{date.toDateString()}
							</Text>
						) : null}
					</View>
				</View>
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "space-around",
						flexDirection: "row",
						width: "100%"
					}}
				>
					<TouchableOpacity
						style={{
							backgroundColor: "white",
							borderRadius: 5,
							width: 100,
							height: 48
						}}
						onPress={() => setShowDatePicker(true)}
					>
						<Text style={[styles.text, styles.buttonText]}>
							Choose Date
						</Text>
					</TouchableOpacity>
					{milestones.length ? (
						<TouchableOpacity
							style={{
								backgroundColor: "white",
								borderRadius: 5,
								width: 100,
								height: 48
							}}
							onPress={() => setShowDatePicker(true)}
						>
							<Text style={[styles.text, styles.buttonText]}>
								Save Dates
							</Text>
						</TouchableOpacity>
					) : null}
				</View>
				<DateTimePickerModal
					isVisible={showDatePicker}
					mode="date"
					onCancel={() => setShowDatePicker(false)}
					onConfirm={handleConfirm}
				/> */}
			</SafeAreaView>
		</View>
	);
};

const styles = StyleSheet.create({
	buttonText: {
		flex: 1,
		fontSize: 18,
		textAlign: "center",
		color: "#330099"
	},
	canvas: {
		height: "100%",
		position: "absolute",
		width: "100%"
	},
	dateText: { fontSize: 37 },
	labelText: { fontSize: 18 },
	text: { color: "white", fontWeight: "bold", fontFamily: "Orbitron" },
	textInput: {
		backgroundColor: "#E0E0E0",
		borderRadius: 5,
		color: "#220066",
		height: 48,
		marginHorizontal: 8,
		padding: 8
	}
});

export default FindEventsScreen;
