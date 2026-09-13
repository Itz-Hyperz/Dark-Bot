module.exports = async function(client, con, interaction, data, language) {
    let selection = interaction.values[0];
    let lol = interaction?.message?.embeds[0]?.footer?.text;
    await con.query(`SELECT * FROM ticketcategories WHERE uniqueid='${selection}'`, async (err, row) => {
        if(err) throw err;
        if (!row[0]) return interaction.reply({ content: language.components.ticketselect.catna, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        if(err) throw err;
        let sheesh = row[0];
        let max = data.maxtickets || 5;
        await con.query(`SELECT * FROM tickets WHERE guildid='${interaction.guild.id}' AND userid='${interaction.user.id}'`, async (err, row) => {
            if(err) throw err;
            if(row[max - 1]) return interaction.reply({ content: `${language.components.ticketselect.content1}${max}${language.components.ticketselect.content2}` , ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });

            let everyoneRole = await interaction.guild.roles.cache.find(role => role.name === "@everyone");
            let permissionOverwriteArray = [{
                    id: interaction.user.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                },
                {
                    id: everyoneRole.id,
                    deny: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                },
                {
                    id: client.user.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                },
            ]
            await con.query(`SELECT * FROM perms WHERE guildid='${interaction.guild.id}' AND permtype='tickets' OR guildid='${interaction.guild.id}' AND permtype='admin'`, async (err, row) => {
                if(err) throw err;
                if(!row[0]) return interaction.reply({ content: language.components.ticketselect.nopset, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                await row.forEach(async (r) => {
                    let yeet = interaction.guild.roles.cache.get(r.roleid);
                    if (yeet != undefined){
                        let tempArray = {
                            id: r.roleid,
                            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                        }
                        permissionOverwriteArray.push(tempArray);
                    };
                });
                await interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
                    type: 'text'
                }).catch(e => {
                    interaction.reply({ content: `${language.components.ticketselect.nocreate}\n\`\`\`\n${e}\n\`\`\``, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                }).then(async chan => {
                    await con.query(`INSERT INTO tickets (guildid, userid, claimedby, channelid, catuniqueid) VALUES ("${interaction.guild.id}", "${interaction.user.id}", "NA", "${chan.id}", "${sheesh.uniqueid}")`, async (err, row) => {
                        if(err) throw err;
                    });
                    await chan.setParent(sheesh.catid, {lockPermissions: false}).catch(e => {
                        if(client.config.debugmode) console.log(e);
                    });
                    await chan.permissionOverwrites.set(permissionOverwriteArray)
                    await chan.setTopic(`${sheesh.catname}`)
                    let channel = chan;
                
                    let buttons = new client.discord.MessageActionRow()
                    .addComponents(
                        new client.discord.MessageButton()
                            .setCustomId('ticketClose')
                            .setLabel(language.components.ticketselect.closetick)
                            .setStyle('DANGER'),
                    )
                    setTimeout(async () => {
                        let starter = new client.discord.MessageEmbed()
                        .setColor(data.themecolor || '#FFFFFF')
                        .setThumbnail(channel.guild.iconURL({ dynamic: true }) || client.user.avatarURL({ dynamic: true }))
                        .setTitle(`${sheesh.catname}`)
                        .setDescription(`${language.components.ticketselect.opened1} \`${interaction.user.tag}\`\n\n${language.components.ticketselect.opened2}`)
                        .setTimestamp()
                        await channel.send({ content: "@everyone", embeds: [starter], components: [buttons] }).catch(e => {})
                    }, 2000);
                    if(lol?.includes('')) {
                        await interaction.message.edit({ components: interaction.message.components })
                        await interaction.reply({ content: `${language.components.ticketselect.success}<#${chan.id}>`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    } else {
                        await interaction.update({ content: `${language.components.ticketselect.success}<#${chan.id}>`, embeds: [], components: [] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    }
                });
            });
        });
    });
};