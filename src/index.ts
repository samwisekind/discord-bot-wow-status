import postDiscordChannelMessage from './discord';

import {
  RESET_EVENT,
  RESET_MESSAGES,
  RESET_WEEKLY_DAY,
} from './constants';

process.env.TZ = 'UTC';

/**
 * Lambda handler function
 * @param {Object} data Lambda event object
 * @param {Object} _context Lambda context object
 * @param {Object} callback Lambda callback function
 * @param {Number} day Current day (as Date number)
 */
const handler = async (
  data: { type: String } | null,
  _context: Object | null,
  callback: Function,
  day: Number = new Date().getDay(),
) => {
  if (data?.type === RESET_EVENT) {
    let message = RESET_MESSAGES.DAILY;
    if (day === RESET_WEEKLY_DAY) {
      message = RESET_MESSAGES.WEEKLY;
    }

    await postDiscordChannelMessage(message);
  }

  return callback(null);
};

exports.handler = handler;

export { handler };
