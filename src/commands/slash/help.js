const { readdirSync} = require('fs');
exports.run = async function(client, con, interaction, data, language) {
    let cmd = interaction.options.getString('command');
    if(!cmd) {
        let select = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageSelectMenu()
                .setCustomId('helpPageSelect')
                .setPlaceholder(language.help.selectAction)
                .addOptions([
                    {
                        label: language.help.user,
                        description: language.help.userDesc,
                        value: '0',
                    },
                    {
                        label: language.help.economy,
                        description: language.help.economyDesc,
                        value: '1',
                    },
                    {
                        label: language.help.music,
                        description: language.help.musicDesc,
                        value: '2',
                    },
                    {
                        label: language.help.utility,
                        description: language.help.utilityDesc,
                        value: '3',
                    },
                    {
                        label: language.help.moderation,
                        description: language.help.moderationDesc,
                        value: '4',
                    },
                    {
                        label: language.help.settings,
                        description: language.help.settingsDesc,
                        value: '5',
                    },
                    {
                        label: language.help.owner,
                        description: language.help.ownerDesc,
                        value: '6',
                    },
                    {
                        label: language.help.credits,
                        description: language.help.creditsDesc,
                        value: '7',
                    }
                ]),
        );
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`${client.user.username} ${language.help.embedTitle}`)
        .setThumbnail(client.user.avatarURL({ dynamic: true }))
        .setFooter({ text: `${language.components.helpPageSelect.footer} ❤️ ${language.components.helpPageSelect.by} Hyperz#0001` })
        .setDescription(client.config.aboutServer || language.help.defaultEmbedDesc || '📜')
        await interaction.reply({ embeds: [embed], components: [select], ephemeral: true });
    } else {
        const commands = readdirSync(__dirname).filter(f => f.endsWith('.js'));
        for (let file of commands) {
            let cinfo = require(`./${file}`);
            if (cmd.toLowerCase() !== cinfo.info.name) continue;
            let embed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setTitle(language.help.individualCommands.embedTitle)
            .setDescription(`${language.help.individualCommands.name} \`${cinfo.info.name}\`\n${language.help.individualCommands.desc} \`${cinfo.info.description}\`\n${language.help.individualCommands.type} \`${language.help.individualCommands.slash}\``)
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
            .setTimestamp()
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};

exports.info = {
    "name": "help",
    "description": "View all commands and info about the bot!",
    "options": [
      {
        "name": "command",
        "description": "View info about a specific command.",
        "required": false,
        "type": "STRING"
      }
    ]
}