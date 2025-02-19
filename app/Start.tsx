import StarryBackground from "@/components/StarryBackground";
import colors from "@/constants/Colors";
import fontSizes from "@/constants/fontSizes";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
	Animated,
	Easing,
	Pressable,
	SafeAreaView,
	Text,
	View
} from "react-native";

const Start = () => {
	const router = useRouter();

	const [triggerFadeIn, setTriggerFadein] = useState(false);

	const fadeAnim = useRef(new Animated.Value(0)).current;
	const rotateAnim = useRef(new Animated.Value(0)).current;
	const translateX = useRef(new Animated.Value(-150)).current;
	const translateY = useRef(new Animated.Value(-75)).current;

	useEffect(() => {
		Animated.loop(
			Animated.timing(rotateAnim, {
				duration: 5000,
				easing: Easing.linear,
				toValue: 1,
				useNativeDriver: true
			})
		).start();

		Animated.timing(translateX, {
			duration: 5000,
			easing: Easing.linear,
			toValue: 300,
			useNativeDriver: true
		}).start(() => {
			setTriggerFadein(true);
		});

		Animated.loop(
			Animated.sequence([
				Animated.timing(translateY, {
					duration: 2000,
					easing: Easing.sin,
					toValue: 75,
					useNativeDriver: true
				}),
				Animated.timing(translateY, {
					duration: 2000,
					easing: Easing.sin,
					toValue: -75,
					useNativeDriver: true
				})
			])
		).start();
	}, []);

	useEffect(() => {
		if (triggerFadeIn) {
			Animated.timing(fadeAnim, {
				duration: 3000,
				toValue: 1,
				useNativeDriver: true
			}).start();
		}
	}, [triggerFadeIn]);

	const rotateInterpolation = rotateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"]
	});

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
				{!triggerFadeIn ? (
					<Animated.View
						style={{
							transform: [{ translateX }, { translateY }]
						}}
					>
						<Animated.View
							style={{
								transform: [{ rotate: rotateInterpolation }]
							}}
						>
							<Image
								source={require("@/assets/images/astronaut.png")}
								style={{ height: 150, width: 150 }}
							/>
						</Animated.View>
					</Animated.View>
				) : (
					<Animated.View style={{ opacity: fadeAnim }}>
						<View
							style={{
								alignItems: "center",
								flex: 8,
								justifyContent: "center"
							}}
						>
							<Text
								style={{
									color: colors.textPrimary,
									fontFamily: "Orbitron",
									fontSize: fontSizes.title,
									fontWeight: "700",
									letterSpacing: 12,

									textAlign: "center"
								}}
							>
								SPACEDOUT
							</Text>
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
					</Animated.View>
				)}
			</SafeAreaView>
		</View>
	);
};

export default Start;
