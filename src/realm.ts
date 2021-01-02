import getBlizzardAPIToken from './blizzard';
import postDiscordChannelMessage from './discord';

import {
  BLIZZARD_REALM_API,
  REALM_STATUS_UP,
  REALM_STATUS_MESSAGES,
} from './constants';

const {
  NODE_ENV,
  REALM_SLUGS,
  REALM_SLUG, // Backwards compatibility for pre-v1.0.2
} = process.env;

const realmStatuses: {
  [key: string]: string;
} = {};

/**
 * Helper for getting realm and connected realm data
 */
const getRealmData = async (slug: string) => {
  const headers = { Authorization: `Bearer ${await getBlizzardAPIToken()}` };

  // Get the realm data for the realm name and connected realm ID
  const realm = await fetch(
    BLIZZARD_REALM_API.replace('{REALM_SLUG}', slug),
    { headers },
  ).then((response) => response.json());

  // Get the connected realm data for the realm status
  const connectedRealm = await fetch(
    realm.connected_realm.href,
    { headers },
  ).then((response) => response.json());

  return { realm, connectedRealm };
};

/**
 * Handler for posting realm statuses message to Discord
 */
const postRealmStatuses = async () => {
  const slugs = String(REALM_SLUGS || /* istanbul ignore next */ REALM_SLUG).split(',');

  /* istanbul ignore if */
  if (NODE_ENV !== 'test') {
    console.log('Posting realm status message to Discord for:', ...slugs);
  }

  const messages: Array<string> = [];

  const results = await Promise.all(slugs.map(getRealmData));

  results.forEach(({ realm, connectedRealm }) => {
    if (
      realmStatuses[realm.slug] // Do nothing on the first request
      && realmStatuses[realm.slug] !== connectedRealm.status.type
    ) {
      let message = REALM_STATUS_MESSAGES.UP;
      if (connectedRealm.status.type !== REALM_STATUS_UP) {
        message = REALM_STATUS_MESSAGES.DOWN;
      }

      message = message.replace('{REALM_NAME}', realm.name.en_US)
        .replace('{REALM_STATUS}', connectedRealm.status.name.en_US.toLowerCase());

      messages.push(message);
    }

    realmStatuses[realm.slug] = connectedRealm.status.type;
  });

  if (messages.length > 0) {
    postDiscordChannelMessage(messages.join('\n'));
  }
};

export default postRealmStatuses;
