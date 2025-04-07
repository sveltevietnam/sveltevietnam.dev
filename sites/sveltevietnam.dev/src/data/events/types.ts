export type EventLocation =
	| {
			type: 'offline';
			place: string;
			googleMapUrl: string;
	  }
	| {
			type: 'online';
			links: { name: string; url: string }[];
	  };

export type Event = {
	id: string;
	slug: string;
	title: string;
	description: string;
	keywords: string;
	location: EventLocation[];
	startDate: string;
	endDate: string;
	ogImage?: string;
};

export type MinimalEvent = Omit<Event, 'id'>;

export type EventMetadataModule =
	| {
			default: MinimalEvent;
	  }
	| {
			en: MinimalEvent;
			vi: MinimalEvent;
	  };
