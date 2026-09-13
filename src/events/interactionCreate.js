module.exports = async function(client, con, interaction) {
    try {
        let c = interaction.customId || interaction.commandName;
        if(!interaction.guild) {
            if (interaction.isCommand()) {
                return interaction.reply({ content: "Please do not run commands in non-guild channels." }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            } else {
                return require(`../components/${c}.js`)(client, con, interaction, null, require(`../utils/languages/${client.config.defaultLanguage || 'english'}.json`));
            };
        };
        await con.query(`SELECT * FROM guilds WHERE guildid='${interaction?.guild?.id}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) await client.utils.guildAdd(client, con, interaction.guild.id);
            let language = require(`../utils/languages/${row[0]?.language || 'english'}.json`);
            if (interaction.isCommand()) {
                let m = [];
                if(interaction.options._hoistedOptions.length != 0) {
                    await interaction.options._hoistedOptions.forEach(async o => {
                        m.push(`\`[${o.type}]\` **${o.name.toUpperCase()}:** ${o.value}`)
                    });
                };
                let logembed = new client.discord.MessageEmbed()
                .setColor(row[0].themecolor)
                .setAuthor({ name: `${language.logging.actionLogs} - ${language.logging.types.command}`, iconURL: client.user.displayAvatarURL() })
                .addFields(
                    {name: `${language.logging.userTag}:`, value: `${interaction.user.tag}`},
                    {name: `${language.logging.channel}:`, value: `<#${interaction.channel.id}>`},
                    {name: `${language.logging.command}:`, value: `\`\`\`less\n${interaction.commandName}\n\`\`\``},
                    {name: `${language.logging.options}:`, value: `${m?.join("\n") || language.logging.noOptions}`},
                )
                .setTimestamp()
                await client.utils.sendLog(client, con, row[0], 'commandlogs', logembed);
                require(`../commands/slash/${c}.js`).run(client, con, interaction, row[0], language);
            } else {
                require(`../components/${c}.js`)(client, con, interaction, row[0], language);
            };
        });
    } catch(e) {
        if(!e.toString().toLowerCase().includes('unknown interaction')) {
            if(client.config.debugmode) console.log(e)
        };
    };
};