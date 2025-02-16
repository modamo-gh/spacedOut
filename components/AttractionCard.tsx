import colors from "@/constants/Colors";
import { AttractionCardProps } from "@/types/AttractionCardProps";
import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction }) => {
	const router = useRouter();

	return (
		<Pressable
			onPress={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
				router.push(`/attraction/${attraction.id}`);
			}}
			style={[styles.container, styles.card]}
		>
			<Image
				cachePolicy="memory-disk"
				source={{ uri: attraction.imageURL }}
				style={styles.image}
			/>
			<View style={[styles.container, styles.textContainer]}>
				<Text style={styles.text}>{attraction.name}</Text>
				<View style={[styles.container, styles.iconContainer]}>
					<Feather
						color={colors.interactiveIcon}
						name="chevron-right"
						style={styles.icon}
					/>
				</View>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	card: {
		justifyContent: "space-between",
		marginBottom: 32
	},
	container: { alignItems: "center", flexDirection: "row" },
	icon: { color: colors.interactiveText, fontSize: 20, marginHorizontal: 16 },
	iconContainer: {
		height: 48,
		justifyContent: "center",
		width: 48
	},
	image: {
		borderRadius: 50,
		height: 72,
		width: 72
	},
	text: {
		color: colors.textPrimary,
		flex: 1,
		flexWrap: "wrap",
		fontFamily: "Geist",
		fontSize: 16
	},
	textContainer: {
		flex: 1,
		paddingLeft: 20
	}
});

export default AttractionCard;
