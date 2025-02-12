import { MapboxMapProps } from "@/types/MapboxMapProps";
import MapboxGL from "@rnmapbox/maps";
import React from "react";
import { View } from "react-native";

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_KEY);

const MapboxMap: React.FC<MapboxMapProps> = ({ latitude, longitude }) => {
	if (!latitude || !longitude) return null;

	return (
		<View
			style={{
				borderRadius: 8,
				flex: 1,
				height: 300,
				overflow: "hidden"
			}}
		>
			<MapboxGL.MapView style={{ flex: 1 }}>
				<MapboxGL.Camera
					centerCoordinate={[longitude, latitude]}
					zoomLevel={12}
				/>
				<MapboxGL.PointAnnotation
					coordinate={[longitude, latitude]}
					id={`${longitude}, ${latitude}`}
				>
					<View
						style={{
							width: 16,
							height: 16,
							borderRadius: 8,
							backgroundColor: "red",
							borderColor: "white",
							borderWidth: 2
						}}
					></View>
				</MapboxGL.PointAnnotation>
			</MapboxGL.MapView>
		</View>
	);
};

export default MapboxMap;
