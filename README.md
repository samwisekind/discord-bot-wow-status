# discord-bot-wow-status

[![Master](https://github.com/Flamov/discord-bot-wow-status/workflows/Master/badge.svg?branch=master)](https://github.com/Flamov/discord-bot-wow-status/actions?query=workflow%3AMaster)
[![Maintainability](https://api.codeclimate.com/v1/badges/58fe1effd4214cf55de5/maintainability)](https://codeclimate.com/github/Flamov/discord-bot-wow-status/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/58fe1effd4214cf55de5/test_coverage)](https://codeclimate.com/github/Flamov/discord-bot-wow-status/test_coverage)
[![Issue Count](https://codeclimate.com/github/Flamov/discord-bot-wow-status/badges/issue_count.svg)](https://codeclimate.com/github/Flamov/discord-bot-wow-status)

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Development](#development)

## Introduction

![Image of the Discord bot messages](https://cdn.flamov.com/misc/discord-bot-wow-status-preview.png?v2)

This repository contains the source files of a Node server written in TypeScript for a Discord bot that automatically posts messages related to _World of Warcraft_. The bot is mostly for private use but it can be installed and used on any Discord server, however it must be hosted manually.

Features of the bot include:

* Monitors a realm and posts messages when the status of the realm changes (useful for weekly maintenance)
* Posts a message when daily quests and weekly raids reset

More features will be added when the APIs relating to features being introduced in _Shadowlands_ are released.

## Installation

The following is required before installing and using the bot:

* [Discord app bot](https://discord.com/developers/applications)
* [Blizzard API client](https://develop.battle.net/accesss)

For both the Discord app and Blizzard API client, redirect and service URLs are not required.

The Discord app bot must be manually connected to a Discord gateway and server:

https://discord.com/developers/docs/topics/gateway#get-gateway-bot

The following environment variables are required when running the server:

| Variable | Description |
| --- | --- |
| ```DISCORD_BOT_TOKEN``` | The token of the bot from the [Discord app](https://discord.com/developers/applications) |
| ```DISCORD_CHANNEL_ID``` | The ID of the Discord channel to post to |
| ```BLIZZARD_CLIENT_ID``` | The client ID of the [Blizzard API client](https://develop.battle.net/access) |
| ```BLIZZARD_CLIENT_SECRET``` | The client secret of the [Blizzard API client](https://develop.battle.net/access) |
| ```REALM_SLUG``` | The slug of the _World of Warcraft_ realm to monitor and post messages about |

The server can be built using Docker:

```console
docker build . -t discord-bot-wow-status
```

The server can then be run by passing in the required environment variables (in detached mode):

```console
docker run \
  -e DISCORD_BOT_TOKEN= \
  -e DISCORD_CHANNEL_ID= \
  -e BLIZZARD_CLIENT_ID= \
  -e BLIZZARD_CLIENT_SECRET= \
  -e REALM_SLUG= \
  -d discord-bot-wow-status
```

Docker Compose can also be used to more easily manage environment variables.

## Usage

Once the server is running, it will post messages to a single Discord channel (`DISCORD_CHANNEL_ID` defined in [Installation](#installation)) when:

* The status of a realm (`REALM_SLUG` defined in [Installation](#installation)) changes
  * The server will poll the _World of Warcraft_ API every 5 minutes
  * The server will only post a message when the realm status changes from its previous state (i.e. it won't post a message for the same status multiple times)
* Daily quests and weekly raids reset
  * The server will post a message every day when daily quests reset and a message on Tuesday when weekly raids reset, both at a fixed time of 1500 UTC (based on the US reset time)

## Development

Below are the NPM commands that can be used for development:

| Command | Description |
| --- | --- |
| ```npm run start``` | Runs the server |
| ```npm run build``` | Compiles TypeScript files into JavaScript |
| ```npm run test``` | Runs TypeScript, ESLint, and unit/integration tests consecutively |
| ```npm run test:eslint``` | Runs ESLint tests |
| ```npm run test:typescript``` | Runs TypeScript tests |
| ```npm run test:typescript:watch``` | Runs `npm run test:typescript` in watch mode |
| ```npm run test:unit``` | Runs unit and integration tests <sup>1</sup> |
| ```npm run test:unit:coverage``` | Runs `npm run test:unit` and also generates a coverage report <sup>1</sup> |
| ```npm run test:unit:watch``` | Runs `npm run test:unit:coverage` in watch mode <sup>1</sup> |

<sup>1</sup> Can be run without needing to run `npm run build`
