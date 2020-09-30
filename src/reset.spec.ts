import postResetMessage from './reset';
import postDiscordChannelMessage from './discord';

jest.mock('./discord', () => ({
  __esModule: true,
  default: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('reset', () => {
  it('Tests daily reset event', async () => {
    await postResetMessage(0);

    expect(postDiscordChannelMessage).toHaveBeenCalledTimes(1);
    expect(postDiscordChannelMessage).toHaveBeenNthCalledWith(1, ':tada: Daily quests have reset');
  });

  it('Tests weekly reset event', async () => {
    await postResetMessage(2);

    expect(postDiscordChannelMessage).toHaveBeenCalledTimes(1);
    expect(postDiscordChannelMessage).toHaveBeenNthCalledWith(1, ':tada: Daily quests and raids have been reset');
  });
});
