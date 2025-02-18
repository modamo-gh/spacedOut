import StarryBackground from "@/components/StarryBackground";
import colors from "@/constants/Colors";
import fontSizes from "@/constants/fontSizes";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, SafeAreaView, Text, View } from "react-native";

const Start = () => {
	const router = useRouter();
	const fadeAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.timing(fadeAnim, {
			duration: 3000,
			toValue: 1,
			useNativeDriver: true
		}).start();
	}, []);

	return (
		<View
			style={{
				alignItems: "center",
				flex: 1,
				justifyContent: "flex-end"
			}}
		>
			<StarryBackground />
			<SafeAreaView
				style={{
					alignItems: "center",
					flex: 1,
					gap: 8,
					justifyContent: "center"
				}}
			>
				<View
					style={{
						alignItems: "center",
						flex: 8,
						justifyContent: "center"
					}}
				>
					<Animated.Text
						style={[
							{
								color: colors.textPrimary,
								fontFamily: "Orbitron",
								fontSize: fontSizes.title,
								fontWeight: "700",
								letterSpacing: 12,
								opacity: fadeAnim,
								textAlign: "center"
							}
						]}
					>
						SPACEDOUT
					</Animated.Text>
				</View>
				<Pressable
					style={{
						alignItems: "center",
						backgroundColor: "#024DDF",
						borderRadius: 8,
						flex: 1,
						justifyContent: "center",
						paddingHorizontal: 16
					}}
				>
					<Text
						style={{
							color: colors.textPrimary,
							fontFamily: "Averta",
							fontSize: fontSizes.large
						}}
					>
						Connect to ticketmaster
					</Text>
				</Pressable>
				<Pressable
					onPress={() => router.push("/(tabs)/findEvents")}
					style={{
						alignItems: "center",
						flex: 1,
						justifyContent: "center"
					}}
				>
					<Text
						style={{
							color: colors.textPrimary,
							fontFamily: "Geist",
							fontSize: fontSizes.large,
							textDecorationLine: "underline"
						}}
					>
						Skip
					</Text>
				</Pressable>
			</SafeAreaView>
		</View>
	);
};

export default Start;
