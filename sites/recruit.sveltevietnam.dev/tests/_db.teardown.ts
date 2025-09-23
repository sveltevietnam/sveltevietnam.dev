import { test as teardown } from '@playwright/test';

import { teardown as teardownDB } from './fixtures/with-backend';

teardown('tear down database', teardownDB);
