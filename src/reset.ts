import postDiscordChannelMessage from './discord';

import {
  RESET_MESSAGES,
  RESET_WEEKLY_DAY,
} from './constants';

/**
 * Reset handler
 * @param {Number} day Current day (as Date number)
 */
const postResetMessage = (
  /* istanbul ignore next */
  day: Number = new Date().getDay(),
) => {
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'test') {
    console.log('Posting reset message to Discord API');
  }

  let message = RESET_MESSAGES.DAILY;
  if (day === RESET_WEEKLY_DAY) {
    message = RESET_MESSAGES.WEEKLY;
  }

  return postDiscordChannelMessage(message);
};

export default postResetMessage;
