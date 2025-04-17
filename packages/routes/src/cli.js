#!/usr/bin/env node

import { program } from 'commander';

import pkg from '../package.json' with { type: 'json' };

program.name('routes').description(pkg.description).version(pkg.version);

program.parse();
