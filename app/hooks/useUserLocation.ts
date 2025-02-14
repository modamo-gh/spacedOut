import { useEffect, useState } from "react";
import * as Location from "expo-location";

export const useUserLocation = () => {
	const [location, setLocation] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	useEffect(() => {
		const getLocation = async () => {
			try {
				const { status } =
					await Location.requestForegroundPermissionsAsync();

				if (status !== "granted") {
					return;
				}

				const locationData = await Location.getCurrentPositionAsync();

				setLocation({
					latitude: locationData.coords.latitude,
					longitude: locationData.coords.longitude
				});
			} catch (error) {
				console.log("Failed to get location", error);
			}
		};

		getLocation();
	}, []);

    return location;
};
