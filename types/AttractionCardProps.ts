import { Attraction } from "./Attraction";

export type AttractionCardProps = {
	attraction: Attraction;
	getEventResults: (id: string) => Promise<void>;
};
