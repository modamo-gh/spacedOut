import React, { useMemo } from "react";
import { Dimensions, Text, View } from "react-native";

const notes = [".", "·", "•"];

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const generateStars = () => {
	const stars = [];

	for (let i = 0; i < 25; i++) {
		stars.push({
			id: i,
			left: Math.random() * screenWidth,
			size: Math.random() * 80,
			top: Math.random() * screenHeight
		});
	}

	return stars;
};

const StarryBackground = React.memo(() => {
	const stars = useMemo(() => generateStars(), []);

	return (
		<View
			style={{
				backgroundColor: "#2E0191",
				height: "100%",
				position: "absolute",
				width: "100%"
			}}
		>
			{stars.map((star) => (
				<Text
					style={{
						color: "#FFFFFF",
						fontSize: star.size,
						left: star.left,
						opacity: 0.2 + Math.random() * 0.15,
						position: "absolute",
						top: star.top
					}}
				>
					{notes[Math.floor(Math.random() * notes.length)]}
				</Text>
			))}
		</View>
	);
});

export default StarryBackground;
