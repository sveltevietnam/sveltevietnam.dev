import jobImg from '$shared/assets/images/fallback/job.png';
import type { Contributor, Event, Job, Project, Sponsor } from '$shared/types';

import vietnamImg from './vietnam-image.jpg';

export function createMockedSponsors() {
  return [
    {
      id: crypto.randomUUID(),
      href: '',
      image: '',
      name: 'Sponsor 1',
    },
    {
      id: crypto.randomUUID(),
      href: '',
      image: '',
      name: 'Nhà tài trợ 2',
    },
    {
      id: crypto.randomUUID(),
      href: 'http://github.com/sveltevietnam',
      image: '',
      name: 'Svelte Vietnam',
    },
  ] satisfies Sponsor[];
}

export function createMockedEvent() {
  return {
    id: crypto.randomUUID(),
    description:
      'Hackathon Svelte sẽ diễn ra tại TPHCM vào tháng 4 năm 2023, hướng tới các nhà phát triển web để thiết kế và phát triển các ứng dụng web độc đáo và ấn tượng sử dụng framework Svelte.',
    title: 'Khám phá tiềm năng của framework Svelte: Hackathon Svelte đầu tiên',
    location: '4 Đ. Đặng Hữu Phổ, Thảo Điền, Quận 2, Thành phố Hồ Chí Minh',
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
    sponsors: createMockedSponsors(),
  } satisfies Event;
}

export function createMockedEvents(length: number) {
  return new Array(length).fill(createMockedEvent());
}

export function createMockedJobs(length?: number, sponsor?: Sponsor) {
  const expiresAt = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();
  const createdAt = new Date().toISOString();
  const jobs: Job[] = [
    {
      id: crypto.randomUUID(),
      title: 'Senior Frontend Developer - Svelte',
      image: jobImg,
      href: '#',
      company: 'Company Name - Vietnam Subsidiary',
      createdAt,
    },
    {
      id: crypto.randomUUID(),
      title: 'Job by a Sponsor',
      image: jobImg,
      href: '#',
      company: 'Company Name - Vietnam Subsidiary',
      createdAt,
      sponsor: sponsor ?? createMockedSponsors()[0],
    },
    {
      title: 'Job With No Location',
      id: crypto.randomUUID(),
      image: jobImg,
      href: '#',
      company: 'Company Name - Vietnam Subsidiary',
      expiresAt,
      createdAt,
      salary: '$1000-$2000',
      locationPolicy: 'remote',
    },
    {
      title: 'Job With No Location Policy',
      id: crypto.randomUUID(),
      image: jobImg,
      href: '#',
      company: 'Company Name - Vietnam Subsidiary',
      createdAt,
      salary: 'Negotiable',
      location: 'Ho Chi Minh',
    },
    {
      title: 'Job With No Salary Detail',
      id: crypto.randomUUID(),
      image: jobImg,
      href: '#',
      company: 'Company Name - Vietnam Subsidiary',
      expiresAt,
      createdAt,
      locationPolicy: 'remote',
    },
    {
      title: 'Job With No Salary Detail',
      id: crypto.randomUUID(),
      image: jobImg,
      href: '#',
      company: 'Company Name - Vietnam Subsidiary',
      expiresAt,
      createdAt,
      salary: '$1000 - $2000',
      locationPolicy: 'hybrid',
      location: 'Ha Noi',
      sponsor: sponsor ?? createMockedSponsors()[0],
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
    id: crypto.randomUUID(),
    name: 'Svelte Vietnam',
    image: vietnamImg,
    description:
      'Svelte Vietnam đang trong giai đoạn khởi tạo, hướng đến trở thành một cộng đồng chính thống và nơi thảo luận, tổng hợp tin tức, sự kiện, việc làm cho thành viên là bất cứ ai quan tâm đến Svelte và các công nghệ trong cùng hệ sinh thái.<br>Svelte Vietnam chào đón tất cả mọi người ko kể tuổi tác, giới tính, tính ngưỡng tôn giáo, ...',
    collaboration:
      'Thiết kế bới Trọng Trần, phát triển bới Quang Phan, open source tại trang Github của Svelte Vietnam',
    href: 'https://sveltevietnam.dev',
  }) satisfies Project[];
}
