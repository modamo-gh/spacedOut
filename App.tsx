import "react-native-reanimated";
import { useState } from "react";
import {
	Dimensions,
	FlatList,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DateTime } from "luxon";
import { Canvas, Circle, Rect } from "@shopify/react-native-skia";
import { useFonts } from "expo-font";

const App = () => {
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
		Orbitron: require("./assets/fonts/Orbitron-VariableFont_wght.ttf")
	});

	const handleConfirm = (date: Date) => {
		setDate(date);

		const concertDate = DateTime.fromJSDate(date);
		const t = DateTime.fromJSDate(today);

		const milestoneDates = [concertDate.toLocaleString(DateTime.DATE_FULL)];

		let daysBetween = 1;

		while (
			concertDate.minus({ days: daysBetween }) >= t &&
			daysBetween < 7
		) {
			milestoneDates.push(
				concertDate
					.minus({ days: daysBetween })
					.toLocaleString(DateTime.DATE_FULL)
			);

			daysBetween *= 2;
		}

		let weeksBetween = 1;

		while (
			concertDate.minus({ weeks: weeksBetween }) >= t &&
			weeksBetween <= 4
		) {
			milestoneDates.push(
				concertDate
					.minus({ weeks: weeksBetween })
					.toLocaleString(DateTime.DATE_FULL)
			);

			weeksBetween *= 2;
		}

		let monthsBetween = 1;

		while (
			concertDate.minus({ months: monthsBetween }) >= t &&
			monthsBetween < 12
		) {
			milestoneDates.push(
				concertDate
					.minus({ months: monthsBetween })
					.toLocaleString(DateTime.DATE_FULL)
			);

			monthsBetween *= 2;
		}

		let yearsBetween = 1;

		while (concertDate.minus({ years: yearsBetween }) >= t) {
			milestoneDates.push(
				concertDate
					.minus({ years: yearsBetween })
					.toLocaleString(DateTime.DATE_FULL)
			);

			yearsBetween *= 2;
		}

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
						justifyContent: "center"
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

export default App;
