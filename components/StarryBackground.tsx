import { Canvas, Circle, Rect } from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, StyleSheet } from "react-native";

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const stars = Array.from({ length: 25 }).map((_, i) => (
	<Circle
		color="rgba(255, 255, 255, 0.20)"
		cx={Math.random() * screenWidth}
		cy={Math.random() * screenHeight}
		key={i}
		r={Math.random() * 5}
	/>
));

const StarryBackground = () => {
	return (
		<Canvas style={styles.canvas}>
			<Rect
				color="#2E0191"
				height={screenHeight}
				width={screenWidth}
				x={0}
				y={0}
			/>
			{stars}
		</Canvas>
	);
};

const styles = StyleSheet.create({
	canvas: {
		height: "100%",
		position: "absolute",
		width: "100%"
	}
});

export default StarryBackground;
