import {
  DISCORD_CHANNEL_API,
  DISCORD_AUTHORIZATION_HEADER,
} from './constants';

/* istanbul ignore next */
const {
  DISCORD_CHANNEL_ID = 'test_discord_channel',
  DISCORD_BOT_TOKEN = 'test_discord_bot_token',
} = process.env;

/* global fetch */
global.fetch = require('node-fetch');

const URI = DISCORD_CHANNEL_API.replace('{CHANNEL_ID}', DISCORD_CHANNEL_ID);
const token = DISCORD_AUTHORIZATION_HEADER.replace('{TOKEN}', DISCORD_BOT_TOKEN);

const postDiscordChannelMessage = async (
  message: String,
) => fetch(
  URI,
  {
    method: 'POST',
    headers: { Authorization: token, 'Content-type': 'application/json' },
    body: JSON.stringify({ content: message }),
  },
);

export default postDiscordChannelMessage;
