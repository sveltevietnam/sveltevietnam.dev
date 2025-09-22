import { test as setup } from '@playwright/test';

import { setup as setupDB } from './fixtures/test-with-backend';

setup('setup database', setupDB);
