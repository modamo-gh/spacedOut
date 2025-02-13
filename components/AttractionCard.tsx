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
				router.push(`/attraction/${attraction.id}`);
			}}
			style={styles.card}
		>
			<Image
				cachePolicy="memory-disk"
				source={{ uri: attraction.imageURL }}
				style={styles.image}
			/>
			<View style={styles.textContainer}>
				<Text style={styles.text}>{attraction.name}</Text>
				<Pressable
					onPress={() => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
						router.push(`/attraction/${attraction.id}`);
					}}
					style={{
						alignItems: "center",
						height: 48,
						justifyContent: "center",
						width: 48
					}}
				>
					<Feather
						color="#9287AB"
						name="chevron-right"
						style={styles.icon}
					/>
				</Pressable>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
		borderRadius: 8,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 32
	},
	icon: { color: "#FFFFFF", fontSize: 20, marginHorizontal: 16 },
	image: {
		borderRadius: 50,
		height: 72,
		width: 72
	},
	text: {
		color: "#FFFFFF",
		flex: 1,
		flexWrap: "wrap",
		fontFamily: "Geist",
		fontSize: 16
	},
	textContainer: {
		alignItems: "center",
		flex: 1,
		flexDirection: "row",
		paddingLeft: 20
	}
});

export default AttractionCard;
