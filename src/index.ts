/* istanbul ignore file */

import cron from 'node-cron';

import postResetMessage from './reset';
import postRealmStatus from './realm';

global.fetch = require('node-fetch');

process.env.TZ = 'UTC';

// Every day at 15:00 UTC
cron.schedule('0 15 * * *', () => {
  try {
    postResetMessage();
  } catch (error) {
    console.error('Unable to post reset message', error);
  }
});

// Every 5 minutes
cron.schedule('*/5 * * * *', () => {
  try {
    postRealmStatus(String(process.env.REALM_SLUG));
  } catch (error) {
    console.error('Unable to post realm status message', error);
  }
});
