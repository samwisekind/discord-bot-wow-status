import fetchMock from 'fetch-mock';

import getBlizzardAPIToken from './blizzard';

afterEach(() => {
  jest.clearAllMocks();
  fetchMock.restore();
});

const credentials = Buffer.from('test_blizzard_client_id:test_blizzard_client_secret').toString('base64');

describe('getBlizzardAPIToken', () => {
  it('Gets a Blizzard API OAuth token successfully', async () => {
    fetchMock.post('begin:https://us.battle.net/oauth/token', { access_token: 'test_access_token' });

    const result = await getBlizzardAPIToken();

    expect(fetchMock.calls().length).toBe(1);
    expect(fetchMock.calls()[0][0]).toBe('https://us.battle.net/oauth/token?grant_type=client_credentials');
    expect(fetchMock.calls()[0][1]).toStrictEqual({
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    expect(result).toBe('test_access_token');
  });
});
