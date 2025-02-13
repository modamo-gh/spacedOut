import { Dispatch, SetStateAction } from "react";

export type SearchBarProps = {
	getAttractions: (searchTerm: string) => Promise<void>;
	setText: Dispatch<SetStateAction<string>>;
	text: string;
};
