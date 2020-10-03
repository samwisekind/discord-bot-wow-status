import getBlizzardAPIToken from './blizzard';

import postDiscordChannelMessage from './discord';

import {
  BLIZZARD_REALM_API,
  REALM_STATUS_UP,
  REALM_STATUS_MESSAGES,
} from './constants';

global.fetch = require('node-fetch');

let lastRealmStatus: string | null = null;

const postRealmStatus = async (slug: string) => {
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
