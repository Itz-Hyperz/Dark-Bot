const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM();
const document = dom.window.document;
const discordTranscripts = require('discord-html-transcripts');
module.exports = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="tickets" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        await con.query(`SELECT * FROM tickets WHERE guildid='${interaction.guild.id}' AND channelid='${interaction.channel.id}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return interaction.reply({ content: `${language.components.ticketClose.a}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            let panel;
            let thisSpecificTicket = row[0];
            await con.query(`SELECT * FROM ticketcategories WHERE uniqueid='${row[0].catuniqueid}'`, async (err, row) => {
                if(err) throw err;
                if(!row[0]) panel = `${language.components.ticketClose.b}`;
                panel = row[0]?.catname || `${language.components.ticketClose.c}`;
            });
            await interaction.reply({ content: `**${interaction.user.tag}** - ${language.components.ticketClose.d}` }).catch(e => {});
            interaction.channel.messages.fetch({ limit: 100 }).then(async(collected) => {
                var messages = {};
                var members = ``;
                collected.forEach(async(msg) => {
                    if (!members.includes(msg.author.tag)) members += msg.author.tag + `\n`;
                });
                if (members == ``) members = `${language.components.ticketClose.e}`;

                var embed = new client.discord.MessageEmbed()
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({dynamic: true}) })
                .setColor(data.themecolor || '#FFFFFF')
                .setAuthor({ name: `${language.components.ticketClose.f}` })
                .addFields(
                    {
                        name: `${language.components.ticketClose.g}`,
                        value: interaction.channel.name,
                        inline: true
                    }, 
                    {
                        name: `${language.components.ticketClose.h}`,
                        value: `${interaction.user}`,
                        inline: true
                    }, 
                    {
                        name: `${language.components.ticketClose.i}`,
                        value: members,
                        inline: true
                    },
                    {
                        name: `${language.components.ticketClose.j}`,
                        value: `${panel}`,
                        inline: true
                    }
                );
                    let attachment = await discordTranscripts.createTranscript(interaction.channel, { limit: -1 });
                    setTimeout(async () => {
                        await con.query(`SELECT * FROM channels WHERE guildid='${interaction.guild.id}' AND channeltype='ticketlogs'`, async (err, row) => {
                            if(err) throw err;
                            if(!row[0]) return;
                            row.forEach(async (c) => {
                                let thechannel = await client.channels.cache.get(c.channelid);
                                if(thechannel != undefined) {
                                    thechannel.send({ content: "**---------------------------------------------------------------------**", embeds: [embed], files: [attachment] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                                };
                            });
                            let uid = thisSpecificTicket?.userid
                            let ticketuser = await client.users.fetch(uid);
                            if(ticketuser != undefined) {
                                ticketuser.send({ content: "**---------------------------------------------------------------------**", embeds: [embed], files: [attachment] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                            };
                        });
                    }, 2000)
            });
            setTimeout(async () => {
                await con.query(`DELETE FROM tickets WHERE guildid='${interaction.guild.id}' AND channelid='${interaction.channel.id}' LIMIT 1`, async (err, row) => {
                    if(err) throw err;
                });
                if(!interaction.channel || interaction.channel == undefined) return;
                interaction.channel.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            }, 8000);
        });
    });
};