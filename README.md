# discord-bot-wow-status

Node server for a Discord Bot.

```console
docker build . -t discord-bot-wow-status
```

```console
docker run \
  -e DISCORD_BOT_TOKEN= \
  -e DISCORD_CHANNEL_ID= \
  -e BLIZZARD_CLIENT_ID= \
  -e BLIZZARD_CLIENT_SECRET= \
  -e REALM_SLUG= \
  -d discord-bot-wow-status
```
