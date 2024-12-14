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

const App = () => {
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [date, setDate] = useState<Date>();
	const [milestones, setMilestones] = useState<string[]>([]);
	const today = new Date();

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

	const screenWidth = Dimensions.get("screen").width;

	return (
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
					backgroundColor: "white",
					alignItems: "stretch",
					justifyContent: "center"
				}}
			>
				<View
					style={{
						flex: 1,
						backgroundColor: "green",
						alignItems: "center",
						justifyContent: "center"
					}}
				>
					<Text style={[styles.text, styles.labelText]}>Today</Text>
					<Text style={[styles.text, styles.labelText]}>{today.toDateString()}</Text>
				</View>
				<View style={{ flex: 8 }}>
					<FlatList
						contentContainerStyle={{ backgroundColor: "purple", flex: 3, justifyContent: "space-around", alignItems: "center", width: screenWidth }}
						data={milestones}
						keyExtractor={(item, index) => index}
						renderItem={(item) => <Text style={[styles.text, styles.dateText]}>{item.item}</Text>}
						style={{ flex: 4 }}
					/>
				</View>
				<View
					style={{
						flex: 1,
						backgroundColor: "orange",
						alignItems: "center",
						justifyContent: "center"
					}}
				>
					<Text style={[styles.text, styles.labelText]}>Target</Text>
					{date ? <Text style={[styles.text, styles.labelText]}>{date.toDateString()}</Text> : null}
				</View>
			</View>
			<View
				style={{
					flex: 1,
					backgroundColor: "blue",
					alignItems: "center",
					justifyContent: "center"
				}}
			>
				<TouchableOpacity
					style={{
						backgroundColor: "red",
						borderRadius: 5,
						width: 100,
						height: 48
					}}
					onPress={() => setShowDatePicker(true)}
				>
					<Text></Text>
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
	dateText: { fontSize: 37, },
	labelText: { fontSize: 17, },
	text: { color: "white", fontWeight: "bold" }
})

export default App;
