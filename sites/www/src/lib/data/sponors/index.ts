export type SponsorsByTier = Record<string, Sponsor[]>;

export type Sponsor = {
	name: string;
	email?: string;
	image?: string;
	link: string;
};

// https://docs.opencollective.com/help/contributing/development/api/members#get-list-of-members
export async function getSponsorsFromOpenCollective(): Promise<SponsorsByTier> {
	const users = (await (
		await fetch('https://opencollective.com/sveltevietnam/members/users.json', {
			cache: 'force-cache',
		})
	).json()) as OpenCollectiveMember[];
	const donors: Sponsor[] = [];
	const byTier: SponsorsByTier = {};
	for (const user of users) {
		if (user.type !== 'USER' || user.role !== 'BACKER') continue;
		const sponsor: Sponsor = {
			name: user.name,
			email: user.email || undefined,
			image: user.image || undefined,
			link: user.website || user.github || user.twitter || user.profile,
		};
		if (user.tier) {
			if (!byTier[user.tier]) byTier[user.tier] = [];
			byTier[user.tier].push(sponsor);
		} else {
			donors.push(sponsor);
		}
	}
	byTier.Donor = donors;

	return byTier;
}

export type OpenCollectiveMember = {
	MemberId: number;
	createdAt: string;
	type: 'USER' | 'ORGANIZATION';
	role: 'ADMIN' | 'BACKER';
	tier?: 'Luna Sponsor' | 'Solis Sponsor';
	isActive: boolean;
	totalAmountDonated: number;
	currency: string;
	lastTransactionAt: string;
	lastTransactionAmount: number;
	profile: string;
	name: string;
	company: string | null;
	description: string | null;
	image: string | null;
	email: string | null;
	twitter: string | null;
	github: string | null;
	website: string | null;
};
