export type ColorScheme = 'light' | 'dark' | 'system';

export interface Event {
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  href: string;
  speakers: EventSpeaker[];
  sponsors: Sponsor[];
}

export interface EventSpeaker {
  image?: string;
  name: string;
  title?: string;
  href?: string;
}

export interface Sponsor {
  /** inline svg with height of 40 */
  image: string;
  name: string;
  href?: string;
}

export interface Job {
  title: string;
  image?: string;
  company: string;
  salary?: string;
  location?: string;
  locationPolicy?: 'remote' | 'hybrid';
  createdAt: string;
  expiresAt?: string;
  sponsored: boolean;
}

export interface Contributor {
  fullName: string;
  contribution: string;
  affiliation?: string;
  links?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface Project {
  name: string;
  description: string;
  collaboration?: string;
  href?: string;
}
