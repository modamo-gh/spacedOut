import { Dispatch, SetStateAction } from "react";
import { Attraction } from "./Attraction";

export type SearchBarProps = {
	getAttractions: (searchTerm: string) => Promise<void>;
	setAttractions: Dispatch<SetStateAction<Attraction[]>>;
	setText: Dispatch<SetStateAction<string>>;
	text: string;
};
