import { useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const App = () => {
	const [showDatePicker, setShowDatePicker] = useState(true);

	const handleConfirm = (date: Date) => {
		console.log(date);

		setShowDatePicker(false);
	};

	return (
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
			<DateTimePickerModal
				isVisible={showDatePicker}
				mode="date"
				onCancel={() => setShowDatePicker(false)}
				onConfirm={handleConfirm}
			/>
		</View>
	);
};

export default App;
