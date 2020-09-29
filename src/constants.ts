const DISCORD_CHANNEL_API = 'https://discord.com/api/channels/{CHANNEL_ID}/messages';

const DISCORD_AUTHORIZATION_HEADER = 'Bot {TOKEN}';

const RESET_EVENT = 'reset-event';

const RESET_MESSAGES = {
  DAILY: ':tada: Daily quests have reset',
  WEEKLY: ':tada: Daily quests and raids have been reset',
};

const RESET_WEEKLY_DAY = 2; // Tuesday

export {
  DISCORD_CHANNEL_API,
  DISCORD_AUTHORIZATION_HEADER,
  RESET_EVENT,
  RESET_MESSAGES,
  RESET_WEEKLY_DAY,
};
