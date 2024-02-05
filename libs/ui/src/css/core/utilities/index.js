import { createRequire } from '../../jss-node-loader.js';

const require = createRequire(import.meta.url);

export default [require('./utilities.css')];
