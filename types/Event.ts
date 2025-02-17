import { Milestone } from "./Milestone";

export type Event = {
	attractions: string[];
	dateTime: string;
	id: string;
	imageURL: string;
	isSaved: boolean;
	latitude: number;
	location: string;
	longitude: number;
	milestones: Milestone[];
	notificationIDs: string[];
	name: string;
	type: string;
};
