import {
  createMockedEvents,
  createMockedJobs,
  createMockedProjects,
  createMockedSponsors,
} from '$shared/mocks';

export async function load() {
  return {
    events: createMockedEvents(1),
    jobs: createMockedJobs(),
    projects: createMockedProjects(4),
    sponsors: createMockedSponsors(),
  };
}
