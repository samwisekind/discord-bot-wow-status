/* istanbul ignore file */

import cron from 'node-cron';

import postResetMessage from './reset';

process.env.TZ = 'UTC';

cron.schedule('0 15 * * *', postResetMessage);
