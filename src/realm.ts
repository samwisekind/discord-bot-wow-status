import getBlizzardAPIToken from './blizzard';
import postDiscordChannelMessage from './discord';

import {
  BLIZZARD_REALM_API,
  REALM_STATUS_UP,
  REALM_STATUS_MESSAGES,
} from './constants';

const {
  NODE_ENV,
  REALM_SLUG,
} = process.env;

let lastRealmStatus: string | null = null;

/**
 * Handler for posting a realm status message to Discord
 */
const postRealmStatus = async () => {
  /* istanbul ignore if */
  if (NODE_ENV !== 'test') {
    console.log('Posting realm status message to Discord');
  }

  const headers = { Authorization: `Bearer ${await getBlizzardAPIToken()}` };

  // Get the realm data for the realm name and connected realm ID
  const realm = await fetch(
    BLIZZARD_REALM_API.replace('{REALM_SLUG}', String(REALM_SLUG)),
    { headers },
  ).then((response) => response.json());

  // Get the connected realm data for the realm status
  const connectedRealm = await fetch(
    realm.connected_realm.href,
    { headers },
  ).then((response) => response.json());

  if (
    lastRealmStatus !== null // Do nothing on the first request
    && lastRealmStatus !== connectedRealm.status.type
  ) {
    let message = REALM_STATUS_MESSAGES.UP;
    if (connectedRealm.status.type !== REALM_STATUS_UP) {
      message = REALM_STATUS_MESSAGES.DOWN;
    }

    message = message.replace('{REALM_NAME}', realm.name.en_US)
      .replace('{REALM_STATUS}', connectedRealm.status.name.en_US.toLowerCase());

    postDiscordChannelMessage(message);
  }

  lastRealmStatus = connectedRealm.status.type;
};

export default postRealmStatus;
