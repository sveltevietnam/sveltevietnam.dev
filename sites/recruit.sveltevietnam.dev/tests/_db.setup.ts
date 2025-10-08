import { test as setup } from '@playwright/test';

import { setup as setupDB } from './fixtures/with-backend';

setup('setup database', setupDB);
