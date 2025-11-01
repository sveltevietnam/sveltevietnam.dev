import { langs } from './i18n/generated/constants.js';
import * as m from './i18n/generated/messages/index.js';
console.log(
	m['simple.used']('en'), // simple message
	m['with_params.used']('vi', { var: 'foo' }), // message with parameters
	langs,
);
