import { config } from "dotenv";
config();

import { Client, Interaction } from "discord.js"
import { REST } from "@discordjs/rest";
import { APIApplicationCommand, Routes, } from "discord-api-types/v9";
import { readdirSync, } from "fs";
import path from "path";

/** A function that handles a chat command */
export type CommandHandler = (interaction: Interaction, client: Client) => void;
/** A extended version of the APIApplicationCommand that has some values set to optional as they are not required */
export type PSGApplicationCommand = Partial<APIApplicationCommand>;
/** A container for a handler of a command and information about it */
export type Command = {
    handler: CommandHandler,
    information: PSGApplicationCommand,
}

/** Returns a list of all the Command objects in the commands directory. */
const collectCommands = (altRelativeDirectory: string = "./commands"): Command[] => {
    let commands: Command[] = [];

    const files: String[] = readdirSync(path.join(__dirname, altRelativeDirectory));
    files.forEach((value) => {
        commands.push(require(path.join(__dirname, altRelativeDirectory, value as string)).default);
    });

    return commands;
};

/**
 * Registers all the commands with Discord.
 */
const registerCommands = async (clientid: string, guildid: string) => {
    try {
        const rest = new REST({ version: '9', }).setToken(process.env.TOKEN ?? "");

        await rest.put(
            Routes.applicationGuildCommands(clientid, guildid),
            {
                body: (collectCommands() ?? []).map((v) => v.information),
            }
        );
    } catch (error) {
        console.error(error);
    }
};

export { collectCommands, registerCommands, };