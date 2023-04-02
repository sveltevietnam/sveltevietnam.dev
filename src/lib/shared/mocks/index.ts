import type { Contributor, Event, Job, Project } from '$shared/types';

export function createMockedEvent() {
  return {
    description:
      'Hackathon Svelte sẽ diễn ra tại TPHCM vào tháng 4 năm 2023, hướng tới các nhà phát triển web để thiết kế và phát triển các ứng dụng web độc đáo và ấn tượng sử dụng framework Svelte.',
    title: 'Khám phá tiềm năng của framework Svelte: Hackathon Svelte đầu tiên',
    location: 'Ho Chi Minh City',
    href: '#',
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setHours(new Date().getHours() + 3)).toISOString(),
    speakers: [
      {
        name: 'Trọng Trần',
      },
      {
        title: 'Svelte và SvelteKit',
        name: 'Quang Phan',
        href: 'https://github.com/vnphanquang',
      },
    ],
    sponsors: [
      {
        href: '',
        image: '',
        name: 'Sponsor 1',
      },
      {
        href: '',
        image: '',
        name: 'Nhà tài trợ 2',
      },
      {
        href: 'http://github.com/sveltevietnam',
        image: '',
        name: 'Svelte Vietnam',
      },
    ],
  } satisfies Event;
}

export function createMockedEvents(length: number) {
  return new Array(length).fill(createMockedEvent());
}

export function createMockedJobs(sponsored = false, length?: number) {
  const expiresAt = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();
  const createdAt = new Date().toISOString();
  const jobs: Job[] = [
    {
      title: 'Senior Frontend Developer - Svelte',
      company: 'Company Name - Vietnam Subsidiary',
      createdAt,
      sponsored,
    },
    {
      title: 'Job With No Location',
      company: 'Company Name - Vietnam Subsidiary',
      expiresAt,
      createdAt,
      salary: '$1000-$2000',
      locationPolicy: 'remote',
      sponsored,
    },
    {
      title: 'Job With No Location Policy',
      company: 'Company Name - Vietnam Subsidiary',
      createdAt,
      salary: 'Negotiable',
      location: 'Ho Chi Minh',
      sponsored,
    },
    {
      title: 'Job With No Salary Detail',
      company: 'Company Name - Vietnam Subsidiary',
      expiresAt,
      createdAt,
      locationPolicy: 'remote',
      sponsored,
    },
    {
      title: 'Job With No Salary Detail',
      company: 'Company Name - Vietnam Subsidiary',
      expiresAt,
      createdAt,
      salary: '$1000 - $2000',
      locationPolicy: 'hybrid',
      location: 'Ha Noi',
      sponsored,
    },
  ];
  if (length) {
    return jobs.slice(0, length);
  }
  return jobs;
}

export function createMockedContributors() {
  return [
    {
      fullName: 'Nguyễn Văn A',
      contribution: 'Creator of A, maintainer of B',
      affiliation: 'developer at company X',
      links: {
        twitter: 'https://twitter.com/username',
        github: 'https://github.com/username',
        linkedin: 'https://linkedin.com/in/username',
        website: 'https://website.com',
      },
    },
    {
      fullName: 'Person With No Affiliation',
      contribution: 'Creator of A, maintainer of B',
      links: {
        twitter: 'https://twitter.com/username',
        github: 'https://github.com/username',
        linkedin: 'https://linkedin.com/in/username',
        website: 'https://website.com',
      },
    },
    {
      fullName: 'Person Without Twitter',
      contribution: 'Creator of A, maintainer of B',
      affiliation: 'developer at company X',
      links: {
        github: 'https://github.com/username',
        linkedin: 'https://linkedin.com/in/username',
        website: 'https://website.com',
      },
    },
    {
      fullName: 'Person Without Linkedin',
      contribution: 'Creator of A, maintainer of B',
      affiliation: 'developer at company X',
      links: {
        twitter: 'https://twitter.com/username',
        github: 'https://github.com/username',
        website: 'https://website.com',
      },
    },
    {
      fullName: 'Person Without Website',
      contribution: 'Creator of A, maintainer of B',
      affiliation: 'developer at company X',
      links: {
        twitter: 'https://twitter.com/username',
        github: 'https://github.com/username',
        linkedin: 'https://linkedin.com/in/username',
      },
    },
    {
      fullName: 'Person With No Link',
      contribution: 'Creator of A, maintainer of B',
      affiliation: 'developer at company X',
    },
    {
      fullName: 'Person Without Github',
      contribution: 'Creator of A, maintainer of B',
      affiliation: 'developer at company X',
      links: {
        twitter: 'https://twitter.com/username',
        linkedin: 'https://linkedin.com/in/username',
        website: 'https://website.com',
      },
    },
  ] satisfies Contributor[];
}

export function createMockedProjects(length = 2) {
  return new Array(length).fill({
    name: 'Project Name',
    description:
      'Project description, target audience is for A, making life easier and creating good something for B.',
    collaboration: 'In collaboration between company A and Person One, Person Two, Person Three',
    href: '#',
  }) satisfies Project[];
}
