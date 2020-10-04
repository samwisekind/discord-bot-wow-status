import {
  BLIZZARD_AUTH_API,
} from './constants';

const {
  BLIZZARD_CLIENT_ID = 'test_blizzard_client_id',
  BLIZZARD_CLIENT_SECRET = 'test_blizzard_client_secret',
} = process.env;

/**
 * Gets and returns a Blizzard API OAuth token
 * @returns {String} OAuth access token
 */
const getBlizzardAPIToken = async () => {
  const credentials = Buffer.from(`${BLIZZARD_CLIENT_ID}:${BLIZZARD_CLIENT_SECRET}`).toString('base64');

  const data = await fetch(BLIZZARD_AUTH_API, {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}` },
  }).then((response) => response.json());

  return data.access_token;
};

export default getBlizzardAPIToken;
