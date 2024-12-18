import {
	Dimensions,
	FlatList,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from "react-native";
import { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DateTime } from "luxon";
import { Canvas, Circle, Rect } from "@shopify/react-native-skia";
import { useFonts } from "expo-font";

const FindEventsScreen = () => {
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [date, setDate] = useState<Date>();
	const [milestones, setMilestones] = useState<string[]>([]);
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
					flex: 1,
					alignItems: "stretch",
					justifyContent: "center"
				}}
			>
				<View
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
				/>
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
		backgroundColor: "red",
		height: "100%",
		position: "absolute",
		width: "100%"
	},
	dateText: { fontSize: 37 },
	labelText: { fontSize: 18 },
	text: { color: "white", fontWeight: "bold", fontFamily: "Orbitron" }
});

export default FindEventsScreen;
