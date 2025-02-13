import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

const BackButton = () => {
	const router = useRouter();

	return (
		<Pressable onPress={() => router.back()} style={styles.button}>
			<Feather name="chevron-left" style={styles.icon} />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		backgroundColor: "rgba(34, 0, 102, 0.75)",
		borderRadius: 50,
		height: 48,
		justifyContent: "center",
		left: 20,
		position: "absolute",
		top: 50,
		width: 48,
		zIndex: 1
	},
	icon: {
		color: "white",
		fontSize: 30
	}
});

export default BackButton;
