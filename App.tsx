import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FindEventsScreen from "./src/screens/FindEventsScreen";
import MyEventsScreen from "./src/screens/MyEventsScreen";
import { NavigationContainer } from "@react-navigation/native";

const Tabs = createBottomTabNavigator({
	screens: {
		MyEvents: MyEventsScreen,
		FindEvents: FindEventsScreen
	}
});

const App = () => {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<NavigationContainer>
				<Tabs.Navigator>
					<Tabs.Screen name="My Events" component={MyEventsScreen} />
					<Tabs.Screen
						name="Find Events"
						component={FindEventsScreen}
					/>
				</Tabs.Navigator>
			</NavigationContainer>
		</GestureHandlerRootView>
	);
};

export default App;
