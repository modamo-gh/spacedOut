import { FlashList } from "@shopify/flash-list";
import { Canvas, Circle, Rect } from "@shopify/react-native-skia";
import { useFonts } from "expo-font";
import { DateTime } from "luxon";
import React, { useState } from "react";
import {
  Dimensions,
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
import { findArtist, getEvents } from "../../services/ticketmaster";

const FindEventsScreen = () => {
	const [date, setDate] = useState<Date>();
	const [events, setEvents] = useState<any[]>([]);
	const [ids, setIDs] = useState<Set<string>>(new Set());
	const [milestones, setMilestones] = useState<string[]>([]);
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [selectedID, setSelectedID] = useState("");
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [text, setText] = useState("");

	const today = new Date();

	const screenHeight = Dimensions.get("screen").height;
	const screenWidth = Dimensions.get("screen").width;
	const [stars, setStars] = useState(() =>
		Array.from({ length: 25 }).map((_, i) => (
			<Circle
				cx={Math.random() * screenWidth}
				cy={Math.random() * screenHeight}
				key={i}
				r={Math.random() * 5}
				color="white"
			/>
		))
	);

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

	const getSearchResults = async (artistName: string) => {
		const { attractions, events } = await findArtist(artistName);

		const setSearchType = (type: any[]) => {
			setSearchResults((prev) => {
				const newResults = [];
				const updatedIDs = new Set(ids);

				for (const t of type) {
					if (!updatedIDs.has(t.id)) {
						updatedIDs.add(t.id);
						newResults.push(t);
					}
				}

				setIDs(new Set(updatedIDs));

				return [...prev, ...newResults];
			});
		};

		setSearchType(attractions);
		setSearchType(events);
	};

	if (!fontsLoaded) {
		return null;
	}

	return (
		<View style={{ flex: 1 }}>
			<Canvas style={styles.canvas}>
				<Rect
					height={screenHeight}
					width={screenWidth}
					x={0}
					y={0}
					color="#330099"
				/>
				{stars}
			</Canvas>
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
						estimatedItemSize={15}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<TouchableOpacity
								onPress={() => {
									setSelectedID(item.id);
									getEventResults(item.id);
								}}
								style={{
									backgroundColor: "#6600CC",
									borderRadius: 8,
									display: "flex",
									flexDirection: "row",
									height: 96,
									alignItems: "center",
									margin: 8,
									padding: 8
								}}
							>
								<Image
									source={{ uri: item.images?.[0]?.url }}
									style={{
										borderRadius: 8,
										height: 72,
										width: 72
									}}
								/>
								<View style={{ paddingLeft: 8 }}>
									<Text
										style={{ color: "white", width: "80%" }}
									>
										{item.name}
									</Text>
									<Text
										style={{
											color: "white",
											flexWrap: "wrap"
										}}
									>
										{item.type === "event"
											? DateTime.fromISO(
													item.dates.start.dateTime
											  ).toLocaleString(
													DateTime.DATETIME_MED_WITH_WEEKDAY
											  )
											: item.id}
									</Text>
									{selectedID && (
										<Text style={{ color: "white" }}>
											{`${
												item._embedded?.venues?.[0].city
													?.name
											}, ${
												item._embedded?.venues?.[0]
													.state?.stateCode ||
												item._embedded?.venues?.[0]
													.country?.countryCode
											}`}
										</Text>
									)}
								</View>
							</TouchableOpacity>
						)}
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
