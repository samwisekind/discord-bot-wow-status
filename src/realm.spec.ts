import fetchMock from 'fetch-mock';

import postDiscordChannelMessage from './discord';
import postRealmStatus from './realm';

jest.mock('./blizzard', () => ({
  __esModule: true,
  default: jest.fn(() => 'test_blizzard_api_token'),
}));

jest.mock('./discord', () => ({
  __esModule: true,
  default: jest.fn(),
}));

beforeEach(() => {
  fetchMock.get(
    'begin:https://us.api.blizzard.com/data/wow/realm/',
    {
      body: {
        name: { en_US: 'test_realm_name' },
        connected_realm: { href: 'https://test-connected-realm-api.com/' },
      },
    },
  );
});

afterEach(() => {
  jest.clearAllMocks();
  fetchMock.restore();
});

describe('postRealmStatus', () => {
  it('Makes first request without posting a message to Discord', async () => {
    fetchMock.get(
      'https://test-connected-realm-api.com/',
      {
        body: {
          status: {
            type: 'UP',
            name: { en_US: 'Up' },
          },
        },
      },
    );

    await postRealmStatus('test_realm_slug');

    const [realm, connectedRealm] = fetchMock.calls();

    expect(realm[0]).toBe('https://us.api.blizzard.com/data/wow/realm/test_realm_slug?namespace=dynamic-us');
    expect(realm[1]).toStrictEqual({ headers: { Authorization: 'Bearer test_blizzard_api_token' } });
    expect(connectedRealm[0]).toBe('https://test-connected-realm-api.com/');
    expect(connectedRealm[1]).toStrictEqual({ headers: { Authorization: 'Bearer test_blizzard_api_token' } });
    expect(postDiscordChannelMessage).toHaveBeenCalledTimes(0);
  });

  it('Posts to Discord when realm status changes after the initial request', async () => {
    fetchMock.get(
      'https://test-connected-realm-api.com/',
      {
        body: {
          status: {
            type: 'DOWN',
            name: { en_US: 'Down' },
          },
        },
      },
    );

    await postRealmStatus('test_realm_slug');

    const [realm, connectedRealm] = fetchMock.calls();

    expect(realm[0]).toBe('https://us.api.blizzard.com/data/wow/realm/test_realm_slug?namespace=dynamic-us');
    expect(realm[1]).toStrictEqual({ headers: { Authorization: 'Bearer test_blizzard_api_token' } });

    expect(connectedRealm[0]).toBe('https://test-connected-realm-api.com/');
    expect(connectedRealm[1]).toStrictEqual({ headers: { Authorization: 'Bearer test_blizzard_api_token' } });

    expect(postDiscordChannelMessage).toHaveBeenCalledTimes(1);
    expect(postDiscordChannelMessage).toHaveBeenNthCalledWith(1, ':red_circle: test_realm_name is *down*');
  });

  it('Posts to Discord when realm status changes after posting for the first time', async () => {
    fetchMock.get(
      'https://test-connected-realm-api.com/',
      {
        body: {
          status: {
            type: 'UP',
            name: { en_US: 'Up' },
          },
        },
      },
    );

    await postRealmStatus('test_realm_slug');

    expect(postDiscordChannelMessage).toHaveBeenCalledTimes(1);
    expect(postDiscordChannelMessage).toHaveBeenNthCalledWith(1, ':green_circle: test_realm_name is *up*');
  });

  it('Does not post to Discord when realm status is the same', async () => {
    fetchMock.get(
      'https://test-connected-realm-api.com/',
      {
        body: {
          status: {
            type: 'UP',
            name: { en_US: 'Up' },
          },
        },
      },
    );

    await postRealmStatus('test_realm_slug');

    expect(postDiscordChannelMessage).toHaveBeenCalledTimes(0);
  });
});
