import fetchMock from 'fetch-mock';

import postDiscordChannelMessage from './discord';
import postRealmStatuses from './realm';

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
    'begin:https://us.api.blizzard.com/data/wow/realm/test_realm_slug_1',
    {
      body: {
        slug: 'test_realm_slug_1',
        name: { en_US: 'test_realm_name' },
        connected_realm: { href: 'https://test-connected-realm-1-api.com/' },
      },
    },
  );

  fetchMock.get(
    'begin:https://us.api.blizzard.com/data/wow/realm/test_realm_slug_2',
    {
      body: {
        slug: 'test_realm_slug_2',
        name: { en_US: 'test_realm_name' },
        connected_realm: { href: 'https://test-connected-realm-2-api.com/' },
      },
    },
  );
});

afterEach(() => {
  jest.clearAllMocks();
  fetchMock.restore();
});

describe('postRealmStatuses', () => {
  it('Makes first request without posting a message to Discord', async () => {
    fetchMock.get(
      'https://test-connected-realm-1-api.com/',
      { body: { status: { type: 'UP', name: { en_US: 'Up' } } } },
    );

    fetchMock.get(
      'https://test-connected-realm-2-api.com/',
      { body: { status: { type: 'UP', name: { en_US: 'Up' } } } },
    );

    await postRealmStatuses();

    const [realm1, realm2, connectedRealm1, connectedRealm2] = fetchMock.calls();

    expect(realm1[0]).toBe('https://us.api.blizzard.com/data/wow/realm/test_realm_slug_1?namespace=dynamic-us');
    expect(realm1[1]).toStrictEqual({ headers: { Authorization: 'Bearer test_blizzard_api_token' } });

    expect(realm2[0]).toBe('https://us.api.blizzard.com/data/wow/realm/test_realm_slug_2?namespace=dynamic-us');
    expect(realm2[1]).toStrictEqual({ headers: { Authorization: 'Bearer test_blizzard_api_token' } });

    expect(connectedRealm1[0]).toBe('https://test-connected-realm-1-api.com/');
    expect(connectedRealm1[1]).toStrictEqual({ headers: { Authorization: 'Bearer test_blizzard_api_token' } });

    expect(connectedRealm2[0]).toBe('https://test-connected-realm-2-api.com/');
    expect(connectedRealm2[1]).toStrictEqual({ headers: { Authorization: 'Bearer test_blizzard_api_token' } });

    expect(postDiscordChannelMessage).toHaveBeenCalledTimes(0);
  });

  it('Posts to Discord for multiple realm status changes', async () => {
    fetchMock.get(
      'https://test-connected-realm-1-api.com/',
      { body: { status: { type: 'DOWN', name: { en_US: 'Down' } } } },
    );

    fetchMock.get(
      'https://test-connected-realm-2-api.com/',
      { body: { status: { type: 'DOWN', name: { en_US: 'Down' } } } },
    );

    await postRealmStatuses();

    expect(postDiscordChannelMessage).toHaveBeenCalledTimes(1);
    expect(postDiscordChannelMessage).toHaveBeenNthCalledWith(
      1,
      ':red_circle: test_realm_name is **down**\n:red_circle: test_realm_name is **down**',
    );
  });

  it('Posts to Discord for a single realm status change', async () => {
    fetchMock.get(
      'https://test-connected-realm-1-api.com/',
      { body: { status: { type: 'UP', name: { en_US: 'Up' } } } },
    );

    fetchMock.get(
      'https://test-connected-realm-2-api.com/',
      { body: { status: { type: 'DOWN', name: { en_US: 'Down' } } } },
    );

    await postRealmStatuses();

    expect(postDiscordChannelMessage).toHaveBeenCalledTimes(1);
    expect(postDiscordChannelMessage).toHaveBeenNthCalledWith(
      1,
      ':green_circle: test_realm_name is **up**',
    );
  });

  it('Does not post to Discord when no realm status changes', async () => {
    fetchMock.get(
      'https://test-connected-realm-1-api.com/',
      { body: { status: { type: 'UP', name: { en_US: 'Up' } } } },
    );

    fetchMock.get(
      'https://test-connected-realm-2-api.com/',
      { body: { status: { type: 'DOWN', name: { en_US: 'Down' } } } },
    );

    await postRealmStatuses();

    expect(postDiscordChannelMessage).toHaveBeenCalledTimes(0);
  });
});
