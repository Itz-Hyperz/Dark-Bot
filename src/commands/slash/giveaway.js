const ms = require('ms');
exports.run = async function(client, con, interaction, data, language) {

    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="giveaway" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(e => {});
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(e => {});

        let deChan = interaction.options.getChannel('channel');
        let color = interaction.options.getString('color_hex');
        color = color.replaceAll('"', '');
        let prize = interaction.options.getString('prize');
        prize = prize.replaceAll('"', '');
        let timelimit = interaction.options.getString('time_limit');
        timelimit = timelimit.replaceAll('"', '');
        let winners = interaction.options.getInteger('winners');
        await con.query(`SELECT COUNT(uniqueid) as total FROM giveaways`, async (err, row) => {
            if(err) throw err;
            if(row[0]) {
                let counted = row[0].total + 1
                try {
                    const buttons = new client.discord.MessageActionRow()
                    .addComponents(
                        new client.discord.MessageButton()
                            .setCustomId('giveawayEnter')
                            .setLabel(language.giveaways.enter)
                            .setStyle(`PRIMARY`),
                    )
                    .addComponents(
                        new client.discord.MessageButton()
                            .setCustomId('giveawayEnd')
                            .setLabel(language.giveaways.end)
                            .setStyle(`DANGER`),
                    )
                    .addComponents(
                        new client.discord.MessageButton()
                            .setCustomId('giveawayReroll')
                            .setLabel(language.giveaways.reroll)
                            .setStyle(`SECONDARY`),
                    )

                        const finish = new client.discord.MessageEmbed()
                        .setColor(data.themecolor || '#FFFFFF')
                        .setDescription(language.giveaways.posted)
                        const panelEmbed = new client.discord.MessageEmbed()
                        .setColor(color || data.themecolor)
                        .setTitle(language.giveaways.embedTitle)
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }) || interaction.user.avatarURL({ dynmamic: true }) || client.user.avatarURL({ dynamic: true }))
                        .setDescription(`${language.giveaways.embedPrize} ${prize}\n${language.giveaways.embedWinners} ${winners}\n${language.giveaways.embedTimeLimit} ${timelimit}`)
                        .setTimestamp()

                        await deChan.send({ embeds: [panelEmbed], components: [buttons] }).then(async msg => {
                            await con.query(`INSERT INTO giveaways (uniqueid, messageid, channelid, prize, winners, timelimit, active, starter) VALUES ('${counted}', '${msg.id}', '${deChan.id}', "${prize}", "${winners}", "${timelimit}", 'true', '${interaction.user.id}')`, async (err, row) => {
                                if(err) throw err;
                                await interaction.reply({ embeds: [finish], ephemeral: true }).catch(e => {});
                                setTimeout(async () => {
                                    await con.query(`SELECT * FROM giveaways WHERE active='true' AND uniqueid='${counted}' AND messageid='${msg.id}'`, async (err, row) => {
                                        if(err) throw err;
                                        if(row[0]) {
                                            client.utils.giveawayPick(client, con, counted, data)
                                        }
                                    });
                                }, ms(timelimit))
                            });
                        }).catch(e => {
                            if(client.config.debugmode) console.log(e);
                        });

                } catch(e) {
                    if(client.config.debugmode) return console.log(e);
                }
            }
        });
    });
};

exports.info = {
    "name": "giveaway",
    "description": "Create a giveaway.",
    "options": [
      {
        "name": "channel",
        "description": "The channel to put the giveaway in.",
        "required": true,
        "type": "CHANNEL"
      },
      {
        "name": "color_hex",
        "description": "The color HEX for the giveaway. (Ex: #FFFFFF)",
        "required": true,
        "type": "STRING"
      },
      {
        "name": "prize",
        "description": "What you intend to give away.",
        "required": true,
        "type": "STRING"
      },
      {
        "name": "time_limit",
        "description": "How long the giveaway should last for.",
        "required": true,
        "type": "STRING"
      },
      {
        "name": "winners",
        "description": "How many winners the giveaway should have.",
        "required": true,
        "type": "INTEGER"
      }
    ]
}