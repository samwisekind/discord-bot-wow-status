const DISCORD_CHANNEL_API = 'https://discord.com/api/channels/{CHANNEL_ID}/messages';

const DISCORD_AUTHORIZATION_HEADER = 'Bot {TOKEN}';

const BLIZZARD_AUTH_API = 'https://us.battle.net/oauth/token?grant_type=client_credentials';

const BLIZZARD_REALM_API = 'https://us.api.blizzard.com/data/wow/realm/{REALM_SLUG}?namespace=dynamic-us';

const RESET_MESSAGES = {
  DAILY: ':tada: Daily quests have reset',
  WEEKLY: ':tada: Daily quests and raids have reset',
};

const RESET_WEEKLY_DAY = 2; // Tuesday

const REALM_STATUS_UP = 'UP';

const REALM_STATUS_MESSAGES = {
  UP: ':green_circle: {REALM_NAME} is **{REALM_STATUS}**',
  DOWN: ':red_circle: {REALM_NAME} is **{REALM_STATUS}**',
};

export {
  DISCORD_CHANNEL_API,
  DISCORD_AUTHORIZATION_HEADER,
  BLIZZARD_AUTH_API,
  BLIZZARD_REALM_API,
  RESET_MESSAGES,
  RESET_WEEKLY_DAY,
  REALM_STATUS_UP,
  REALM_STATUS_MESSAGES,
};
