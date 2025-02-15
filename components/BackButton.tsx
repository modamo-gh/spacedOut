import colors from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

const BackButton = () => {
	const router = useRouter();

	return (
		<Pressable
			onPress={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
				router.back();
			}}
			style={styles.button}
		>
			<Feather name="chevron-left" style={styles.icon} />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		backgroundColor: colors.background,
		borderRadius: 50,
		height: 48,
		justifyContent: "center",
		left: 20,
		position: "absolute",
		opacity: 0.8,
		top: 50,
		width: 48,
		zIndex: 1
	},
	icon: {
		color: colors.interactiveText,
		fontSize: 30
	}
});

export default BackButton;
