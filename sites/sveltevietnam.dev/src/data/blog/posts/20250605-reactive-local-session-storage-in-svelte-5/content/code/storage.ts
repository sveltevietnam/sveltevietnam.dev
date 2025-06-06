import { createReactiveStorage } from './lib';

type StorageValue = {
	str: string | null;
	num: number | null;
	bool: boolean | null;
	obj: {
		str: string | null;
		num: number | null;
		bool: boolean | null;
	};
};

export const storage = createReactiveStorage<StorageValue>(
	[['str', { storage: 'session' }], ['num', { init: 0 }], ['bool', { prefix: 'special:' }], 'obj'],
	{
		prefix: 'app:',
		storage: 'local',
	},
);
