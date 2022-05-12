## Programming Support Group Bot

This is a Discord.JS bot written in TypeScript to run the Programming Support Group bot. This bot is only meant for that server but it is open-sourced and can be –– somewhat –– easily run by yourself for other servers.

If you want a managed instance of the bot, message Eldon#1486 on Discord. We can work out a deal.

### Contributing / Issue Rules

1. Don't [ask to ask!](https://dontasktoask.com)
2. Use TypeScript! Don't try and sprinkle in @eslint-ignore tags everywhere when you get a TypeScript warning.
3. Follow any formats
4. You may suggest features on the discord, this is not the place to do that.

### Running for Yourself

***Please do NOT make Issues or posts in the Discord about not being able to run the bot. Running it for yourself is not officially supported.***

1. You'll need Node –– with npm –– and all the packages we use.
2. You'll need a Discord account with a bot that you have the Token of. Discord changed the way tokens generate so you'll need auth and all that.
3. You'll need some level of comfort with the command line as this bot makes use of CLIs
4. There is a 'empty.env' file at the top level of the bot *[here](./empty.env)*. This file contains all configuration of the bot. There are comments in the file describing what each config type is and how to use it. To use the empty.env file, rename it to .env.
5. Once you configure the bot, you can build it using the 'tsc' command and then run it based off the dist folder.