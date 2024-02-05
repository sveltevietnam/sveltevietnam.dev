import { createRequire } from '../../jss-node-loader.js';

const require = createRequire(import.meta.url);

export default [require('./base.css'), require('./max-w-pad.css'), require('./colors.css')];
