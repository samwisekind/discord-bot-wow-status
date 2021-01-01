import cron from 'node-cron';

import postResetMessage from './reset';
import postRealmStatus from './realm';

global.fetch = require('node-fetch');

process.env.TZ = 'UTC';

const {
  REALM_SLUGS,
  REALM_SLUG, // Backward compatibility for pre-v1.0.2
} = process.env;

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
    String(REALM_SLUGS || /* istanbul ignore next */ REALM_SLUG)
      .split(',').forEach((slug) => postRealmStatus(slug));
  } catch (error) {
    /* istanbul ignore next */
    console.error('Unable to post realm status message', error);
  }
});
