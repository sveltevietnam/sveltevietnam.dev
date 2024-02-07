---
to: <%= baseDir %>/_page/translation/en.ts
unless_exists: true
---
import { en as common } from '../../../translation/en';

export const en = {
	...common,
};
