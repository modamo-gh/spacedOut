import { useState } from "react";
import { TextInput, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const App = () => {
	const [showDatePicker, setShowDatePicker] = useState(true);

	const handleConfirm = (date: Date) => {
		console.log(date);
		
		setShowDatePicker(false)
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
