import type { Event } from '$shared/types';

export function createMockedEvent() {
  return {
    description:
      'Brief description of this event. For example, on which occasion, what will happen, ...',
    title: 'Title of The Event',
    location: 'Location of the event',
    href: '#',
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setHours(new Date().getHours() + 1)).toISOString(),
    highlights: [
      {
        description: 'Highlight details, without image',
        title: 'Some Highlight',
      },
      {
        description: 'Some presentation about something',
        title: 'Speaker Name',
        image: 'https://avatars.githubusercontent.com/u/25895844?v=4',
      },
    ],
    sponsors: [
      {
        href: '',
        image: '<div class="c-sponsor w-[200px]"></div>',
        name: 'Sponsor 1',
      },
      {
        href: '',
        image: '<div class="c-sponsor w-[200px]"></div>',
        name: 'Sponsor 2',
      },
      {
        href: '',
        image: '<div class="c-sponsor w-[200px]"></div>',
        name: 'Sponsor 2',
      },
    ],
  } satisfies Event;
}

export function createMockedEvents(length: number) {
  return new Array(length).fill(createMockedEvent());
}
