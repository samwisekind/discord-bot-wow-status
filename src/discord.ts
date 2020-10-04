import {
  DISCORD_CHANNEL_API,
  DISCORD_AUTHORIZATION_HEADER,
} from './constants';

const {
  DISCORD_BOT_TOKEN,
  DISCORD_CHANNEL_ID,
} = process.env;

const token = DISCORD_AUTHORIZATION_HEADER.replace('{TOKEN}', String(DISCORD_BOT_TOKEN));
const URI = DISCORD_CHANNEL_API.replace('{CHANNEL_ID}', String(DISCORD_CHANNEL_ID));

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
