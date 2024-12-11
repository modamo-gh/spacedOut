import { TextInput, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const App = () => {
	return <View style={{ flex: 1, backgroundColor: "blue", alignItems: "center", justifyContent: "center" }}>
		<DateTimePickerModal 
		isVisible="true"
		mode="date"/>
	</View>
}

export default App;