import { test as teardown } from '@playwright/test';

import { teardown as teardownDB } from './fixtures/test-with-backend';

teardown('setup database', teardownDB);
