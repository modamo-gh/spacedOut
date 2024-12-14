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

	const intervals = [
		{ type: "days", amount: 0 },
		{ type: "days", amount: 1 },
		{ type: "days", amount: 2 },
		{ type: "days", amount: 4 },
		{ type: "weeks", amount: 1 },
		{ type: "weeks", amount: 2 },
		{ type: "weeks", amount: 4 },
		{ type: "months", amount: 1 },
		{ type: "months", amount: 2 },
		{ type: "months", amount: 4 },
		{ type: "months", amount: 8 }
	];

	const handleConfirm = (date: Date) => {
		setDate(date);

		const concertDate = DateTime.fromJSDate(date);

		const milestoneDates = [];

		for (const interval of intervals) {
			const dateInfo: { [key: string]: number } = {};

			dateInfo[interval.type] = interval.amount;

			const potentialDate = concertDate.minus(dateInfo);

			if (potentialDate >= DateTime.fromJSDate(today)) {
				milestoneDates.push(
					potentialDate.toLocaleString(DateTime.DATE_FULL)
				);
			}
		}

		setMilestones(milestoneDates.reverse());
		setShowDatePicker(false);
	};



	if (!fontsLoaded) {
		return null;
	}

	return (
		<SafeAreaView
			style={{
				backgroundColor: "#330099",
				flex: 1,
				alignItems: "stretch",
				justifyContent: "center"
			}}
		>
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
					<Text style={[styles.text, styles.labelText]}>Today</Text>
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
					<Text style={[styles.text, styles.labelText]}>Target</Text>
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
	);
};

const styles = StyleSheet.create({
	buttonText: {
		flex: 1,
		fontSize: 18,
		textAlign: "center",
		color: "#330099"
	},
	canvas: { height: "100%", position: "absolute", width: "100%" },
	dateText: { fontSize: 37 },
	labelText: { fontSize: 18 },
	text: { color: "white", fontWeight: "bold", fontFamily: "Orbitron" }
});

export default App;
