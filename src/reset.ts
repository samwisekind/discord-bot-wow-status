import postDiscordChannelMessage from './discord';

import {
  RESET_MESSAGES,
  RESET_WEEKLY_DAY,
} from './constants';

const {
  NODE_ENV,
} = process.env;

/**
 * Handler for posting a reset message to Discord
 * @param day Current day (as Date number)
 */
const postResetMessage = (
  /* istanbul ignore next */
  day: Number = new Date().getDay(),
) => {
  /* istanbul ignore if */
  if (NODE_ENV !== 'test') {
    console.log('Posting reset message to Discord');
  }

  let message = RESET_MESSAGES.DAILY;
  if (day === RESET_WEEKLY_DAY) {
    message = RESET_MESSAGES.WEEKLY;
  }

  postDiscordChannelMessage(message);
};

export default postResetMessage;
