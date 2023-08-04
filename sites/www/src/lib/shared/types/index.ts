export type ColorScheme = 'light' | 'dark' | 'system';

export type Event = {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  href: string;
  speakers: EventSpeaker[];
  sponsors: Sponsor[];
};

export type EventSpeaker = {
  image?: string;
  name: string;
  title?: string;
  href?: string;
};

export type Sponsor = {
  id: string;
  /** inline svg with height of 40 */
  image: string;
  name: string;
  href?: string;
};

export type Job = {
  id: string;
  title: string;
  href: string;
  image?: string;
  company: string;
  salary?: string;
  location?: string;
  locationPolicy?: 'remote' | 'hybrid';
  createdAt: string;
  expiresAt?: string;
  sponsor?: Sponsor;
};

export type ProfileLinks = {
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
};

export type Contributor = {
  fullName: string;
  contribution: string;
  affiliation?: string;
  links?: ProfileLinks;
};

export type Project = {
  id: string;
  name: string;
  image?: string;
  description: string;
  collaboration?: string;
  href?: string;
};
