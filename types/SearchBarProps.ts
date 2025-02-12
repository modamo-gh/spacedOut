import { Dispatch, SetStateAction } from "react";
import { Attraction } from "./Attraction";

export type SearchBarProps = {
	getAttractions: (searchTerm: string) => Promise<void>;
    setSearchResults: Dispatch<SetStateAction<Attraction[]>>;
	setText: Dispatch<SetStateAction<string>>;
	text: string;
};
