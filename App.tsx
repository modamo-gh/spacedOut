import { TextInput, View } from "react-native";

const App = () => {
	return <View style={{ flex: 1, backgroundColor: "blue", alignItems: "center", justifyContent: "center" }}>
		<TextInput style={{height: 48, width: 80, backgroundColor: "white"}} placeholder="Enter Artist"/>
	</View>
}

export default App;