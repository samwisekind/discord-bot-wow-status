import cron from 'node-cron';

import postResetMessage from './reset';
import postRealmStatuses from './realm';

global.fetch = require('node-fetch');

process.env.TZ = 'UTC';

// Every day at 15:00 UTC
cron.schedule('0 15 * * *', () => {
  try {
    postResetMessage();
  } catch (error) {
    /* istanbul ignore next */
    console.error('Unable to post reset message', error);
  }
});

// Every 60 seconds
cron.schedule('* * * * *', () => {
  try {
    postRealmStatuses();
  } catch (error) {
    /* istanbul ignore next */
    console.error('Unable to post realm status message', error);
  }
});
