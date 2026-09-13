const { Client, Collection } = require('discord.js');
const { readdirSync, existsSync } = require('fs');
const { join } = require('path');
const mysql = require('mysql');
const chalk = require('chalk');
const express = require("express");
const figlet = require('figlet');
const axios = require('axios');
const DarkBotEvents = require('events');
const darkbot = new DarkBotEvents();
darkbot.defaultMaxListeners = 99;
const djs = require(`hyperz-djs-embed-builder`);
const discordModals = require('discord-modals')
const { DiscordTogether } = require('discord-together');
const config = require('../config.js');

const defaultLanguage = require(`./utils/languages/${config.defaultLanguage || 'english'}.json`);
global.cmdLang = defaultLanguage.commands;
let langs = [];
const langsFound = readdirSync(join(__dirname, `./`, `utils/languages`));
langsFound.forEach(async function(e) {
    let name = e.split('.')[0];
    name = name.toLowerCase();
    await langs.push(name);
});

let useSQL = true; // DO NOT CHANGE THIS UNLESS YOU KNOW WHAT YOU ARE DOING
let con;

class HDClient extends Client {
    constructor(options = {}) {
        super(options);

        this.config = require(`../config.js`);
        this.utils = require(`./utils/utils.js`);
        this.discord = require('discord.js');
        this.converterEmoji = require('hyperz-emoji-converter');
        this.darkbot = darkbot;
        this.extensionInteractions = [];
        this.snipes = new Collection();
        this.defaultLanguage = defaultLanguage;

        this.pages = [
            // user
            "`ping` - Check latency.\n`help` - Gets you this menu.\n`games` - Play a game via the Discord API.\n`8ball` - Talk to god.\n`afk` - Mark yourself AFK.\n`avatar` - Get a users current avatar.\n`apply` - Apply for something.\n`birthdays` - Manage your birthday.\n`ascii` - Write text via Figlet.\n`ddos` - Sends a fake DDOS attack.\n`dice` - Roll the dice.\n`hug` - Hug another user.\n`leaderboard` - View the leaderboard.\n`level` - View a users current level.\n`marriage` - Open the marriage system.\n`meme` - Get a funny meme.\n`snipe` - Get the last deleted message.\n`ticket` - Create a ticket.\n`timer` - Set a timer for something.\n`wink` - Send a wink gif.\n`credits` - View the bots credits.",
            // economy
            "`work` - Go to work.\n`crime` - Commit a crime.\n`rob` - Rob somebody.\n`balance` - View your bank account.\n`shop` - Open this guilds shop.\n`inventory` - View your inventory.",
            // music
            "`play` - Play a song.\n`queue` - View the queue.\n`loop` - Toggle looping for the current song.\n`music` - Get the music controls.\n`volume` - Change the music volume.",
            // utilites
            "`case` - View a case by Id.\n`clients` - View this guilds clients.\n`embed` - Post an embed.\n`embedbuilder` - Run the embed builder.\n`giveaway` - Create a giveaway.\n`guilds` - View this bots guilds.\n`pay` - Send payment embeds with a specified amount.\n`poll` - Ask a question.\n`punishments` - View a users case history.\n`review` - Leave a review on something.\n`say` - Say something as the bot.\n`server` - View this servers information.\n`suggest` - Create a suggestion.\n`ticketbuttons` - Get some handy ticket buttons.\n`tos` - Ask a user to agree to your terms of service.\n`user` - View a users information.",
            // moderation
            "`ban` - Ban a user from the guild.\n`dm` - Direct message a user.\n`kick` - Remove a user from the guild.\n`mute` - Mute a user in the server.\n`offlineban` - Ban someone who isn't in the server.\n`purge` - Clear messages in a channel.\n`removecase` - Remove a case from the database.\n`unban` - Remove a ban on a user.\n`unmute` - Unmute a user.\n`warn` - Warn a user.",
            // settings
            "`applicationmenu` - Create and delete applications.\n`clientmenu` - Manage this guilds clients.\n`massrole` - Give all users a certain role.\n`pingprev` - Manage this guilds ping prevention.\n`selfroles` - Manage this guilds self roles.\n`sticky` - Manage this guilds sticky messages.\n`ticketpanels` - Manage this guilds ticket panels.",
            // owner
            "`settings` - Change this guilds settings.\n`permissions` - Change this guilds permissions.\n`logging` - Change this guilds logging channels.\n`restart` - Restart the bot client.",
            // credits
            `**Creators:**\n[@Hyperz](https://store.hyperz.net/store) - *Actually writing all of the code.*\n\n**Language Conversion:**\n[@Xolify](https://discord.com/users/539975000799838249) - *Commissioned to convert files.*\n[@Shawn E.](https://discord.com/users/668497496124686347) - *Commissioned to convert files.*\n\n**Other:**\n[@Sin](https://discord.com/users/771935774903894037) - *Design idea for music system.*\n[@PlutoTheDev](https://discord.com/users/399718367335940117) - *Design idea for review system.*\n[@NAT2K15](https://discord.com/users/576971985108860929) - *Design idea (partially) for application system.*`
        ];
    };
};

const client = new HDClient({
    intents: ['GUILDS', 'GUILD_MESSAGES', "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING"],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'ROLE', "GUILD_MEMBER", "USER", "GUILD_INVITES", "MANAGE_GUILD"],
    allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: true }
});
client.embed = new djs(client).createEmbed;
client.games = new DiscordTogether(client);
client.refreshButton = new client.discord.MessageActionRow().addComponents(
    new client.discord.MessageButton()
    .setLabel('Refresh')
    .setStyle('SUCCESS')
    .setCustomId('refresh')
);
discordModals(client);
global.__basedir = __dirname;

setTimeout(function() {
    const version = Number(process.version.split('.')[0].replace('v', ''));
    if (version < 16) return console.log(chalk.blue('\n\nPlease upgrade to Node v16 or higher\nPlease upgrade to Node v16 or higher\nPlease upgrade to Node v16 or higher\n\n'));
}, 8000);

const init = async function() {
    let font = await client.utils.maths(["Graffiti", "Standard", "Varsity", "Stop", "Speed", "Slant", "Pagga", "Larry 3D"])
    figlet.text('Dark Bot', { font: font, width: 700 }, function(err, data) {
        if(err) throw err;
        let str = `${data}\n-------------------------------------------`
        console.log(chalk.bold(chalk.blueBright(str)));
    });
    try {
        client.login(client.config.token).catch(function(e) { console.log(e) });
        if (useSQL) {
            try {
                const stuff = client.config.database
                con = mysql.createConnection(stuff)
                setTimeout(function() {
                    console.log(`${chalk.yellowBright('[SQL Manager]')} MySQL Successfully Connected!`)
                }, 4000);
                con.on('enqueue', function () {
                    if(client.config.debugmode) {
                        console.log(`${chalk.yellowBright('[SQL Manager]')} Waiting for available connection slot`);
                    }
                });
                con.on('release', function (connection) {
                    if(client.config.debugmode) {
                        console.log(`${chalk.yellowBright('[SQL Manager]')} Connection %d released`, connection.threadId);
                    }
                });
                require('./updateManager.js')(con, chalk);
            } catch (e) {
                client.utils.error(client, e)
                return process.exit(1);
            }
        }

        const app = express()
        app.listen(client.config.port)

        // Global Variable Creation
        global.darkClient = client;
        global.darkCon = con;
        global.darkApp = app;
        global.darkEvents = client.darkbot;
        global.darkLangs = langs;

        // Event handler
        const events = readdirSync(join(__dirname, `./`, `events`));
        events.forEach(function(e) {
            const name = e.split('.')[0];
            const event = require(`./events/${e}`);
            client.on(name, event.bind(null, client, con));
            delete require.cache[require.resolve(`./events/${e}`)];
        });

        setTimeout(async function() {
            let currver = require('../package.json').version
            let request = await axios({
                method: 'get',
                url: `https://raw.githubusercontent.com/Itz-Hyperz/version-pub-api/main/versions.json`,
                headers: {Accept: 'application/json, text/plain, */*','User-Agent': '*' }
            });
            let latestver = request.data.darkbot
            if(latestver != currver) {
                console.log(`${chalk.blueBright(`[Version Manager]`)} ${chalk.red(`You are not on the latest version. Current Version: ${chalk.yellow(currver)} | Latest Version: ${chalk.blueBright(latestver)}`)}`)
            } else {
                console.log(`${chalk.blueBright(`[Version Manager]`)} You are on the latest version - ${chalk.white(currver)}`)
            };

            setTimeout(async function() {
                // Extension Handler
                const extensionsFolder = await readdirSync(join(__dirname, `./`, `extensions`));
                await extensionsFolder.forEach(async function(extFolder) {
                    let extPath = join(__dirname, `./`, `extensions/${extFolder}`)
                    let extFolderName = extFolder;
                    extFolder = readdirSync(extPath);
                    if(extFolder.includes('extension.json')) {
                        let extConfig = require(extPath + '/extension.json');
                        console.log(`${chalk.magentaBright('[Extension Manager]')} ${extConfig?.name} (${extConfig?.version}) - Loaded`);
                        if(existsSync(extPath + `/${extConfig?.file}`)) {
                            require(`./extensions/${extFolderName}/${extConfig?.file}`)(client, con, app);
                        } else {
                            console.log(`${chalk.magentaBright('[Extension Manager]')} ${chalk.yellowBright('FAILED:')} ${extFolderName} - Missing executable file.`);
                        };
                    } else {
                        console.log(`${chalk.magentaBright('[Extension Manager]')} ${chalk.yellowBright('FAILED:')} ${extFolderName} - Missing data file.`);
                    };
                });
                if(typeof extensions == 'undefined') return;
                for(let ext of extensions) {
                    const extName = ext.split('.')[0];
                    console.log(`${chalk.magentaBright('[Extension Manager]')} ${extName} - Loaded`);
                    require(`./extensions/${ext}`)(client, con, app);
                };
            }, 3000);
        }, 150)
        client.languages = langs;
    } catch(e) {
        console.log(e)
    }
}

process.on('unhandledRejection', function(err) { 
    let ignore = [
        "DisTubeError [RESUMED]:",
        "DisTubeError [NO_QUEUE]:",
        "DisTubeError [PAUSED]:",
        "].type: This field is required",
        "Unknown Message",
        "Cannot find module '../components/"
    ];
    let stillLog = true;
    ignore.forEach(function(e) {
        if(err.toString().includes(e)) {
            stillLog = false;
        }
    })
    if(!stillLog) return;
    console.log(chalk.red(`\nFATAL ERROR: \n\n`, err.stack))
});

exports.init = init;
