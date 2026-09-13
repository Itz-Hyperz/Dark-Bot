module.exports = async function(client, con, oldState, newState) {
    await con.query(`SELECT * FROM guilds WHERE guildid='${oldState.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return;
        let data = row[0];
        let language = require(`../utils/languages/${row[0]?.language || 'english'}.json`)
        let logEmbed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor({ name: `${language.logging.actionLogs} - ${language.events.voice.update}`, iconURL: client.user.displayAvatarURL() })
        .setTimestamp()
        let oldChannel = await client.channels.cache.get(oldState?.channelId);
        let newChannel = await client.channels.cache.get(newState?.channelId);
        if(oldChannel == undefined) oldChannel = language.events.voice.unavailable;
        if(newChannel == undefined) newChannel = language.events.voice.unavailable;
        if(!oldState?.member?.user || !newState?.member?.user) return;

        con.query(`SELECT * FROM privatecalls WHERE guildid="${data.guildid}" AND uniqueid="${oldState?.channelId}"`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return;
            let channel = await client.channels.cache.get(oldState?.channelId);
            if(channel.members.size > 0) return;
            setTimeout(async () => {
                channel = await client.channels.cache.get(oldState?.channelId);
                if(channel.members.size > 0) return;
                await channel.delete().catch(e => {
                    if(client.config.debugmode) console.log(e);
                }); // Auto delete from the privatecalls should occur through channelDelete event
            }, 4000); // 4 second timeout before the channel is deleted
        });

        if(newChannel.id == data.privatecallcreate) {
            con.query(`SELECT * FROM privatecalls WHERE guildid="${data.guildid}" AND ownerid="${newState?.member?.user?.id}"`, async (err, row) => {
                if(err) throw err;
                if(row[0]) return newState?.member?.voice.disconnect();
                let everyoneRole = await newChannel.guild.roles.cache.find(role => role.name === "@everyone");
                let permissionOverwriteArray = [{
                        id: newState?.member?.user.id,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS']
                    },
                    {
                        id: everyoneRole.id,
                        deny: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS']
                    },
                    {
                        id: client.user.id,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS']
                    },
                ];
                await newChannel.guild.channels.create(`${newState?.member?.user.username} VC 🔒`, {
                    type: 'GUILD_VOICE'
                }).catch(e => {
                    if(client?.config?.debugmode) console.log(e);
                }).then(async chan => {
                    await con.query(`INSERT INTO privatecalls (guildid, uniqueid, ownerid, alloweduserids) VALUES ("${newChannel.guild.id}", "${chan.id}", "${newState?.member?.user.id}", "[]")`, async (err, row) => {
                        if(err) throw err;
                    });
                    await chan.setParent(data.privatecallcategory, {lockPermissions: false}).catch(e => {
                        if(client.config.debugmode) console.log(e);
                    });
                    await chan.permissionOverwrites.set(permissionOverwriteArray);
                    let vcmanager = new client.discord.MessageEmbed()
                    .setColor(data.themecolor || '#FFFFFF')
                    .setAuthor({ name: newChannel.guild.name, iconURL: newChannel.guild.iconURL() })
                    .setTitle(`📢 ${language.vcManager}`)
                    .setDescription(`${language.vcDesc}\n\n**Channel:**\n<#${chan.id}>\n\n`)
                    .setFooter({ text: chan.id })
                    .setTimestamp()
                    let buttons = new client.discord.MessageActionRow()
                    .addComponents(
                        new client.discord.MessageButton()
                        .setLabel(language.components.settingsBaseGeneralSettings.options)
                        .setStyle('SECONDARY')
                        .setCustomId('settingsBaseDisabled1')
                        .setDisabled(true)
                    )
                    .addComponents(
                        new client.discord.MessageButton()
                        .setLabel(language.vcAddMember)
                        .setStyle('SUCCESS')
                        .setCustomId('privateVoiceAddMember')
                    )
                    .addComponents(
                        new client.discord.MessageButton()
                        .setLabel(language.vcRemoveMember)
                        .setStyle('DANGER')
                        .setCustomId('privateVoiceRemoveMember')
                    )
                    .addComponents(
                        new client.discord.MessageButton()
                        .setLabel(language.vcCloseChannel)
                        .setStyle('SECONDARY')
                        .setCustomId('privateVoiceClose')
                    )
                    await newState?.member?.user.send({ embeds: [vcmanager], components: [buttons] }).catch(e => { if(client?.config?.debugmode) console.log(e); });
                    await newState?.member?.voice.setChannel(chan.id).catch(e => { if(client?.config?.debugmode) console.log(e); });
                });
            });
        };

        // Logging Stuff
        if(oldState.serverDeaf != newState.serverDeaf) { // Server Deafen
            if(newState.serverDeaf) {
                logEmbed.setDescription(`${newState.member.user.tag} ${language.events.voice.was} \`${language.events.voice.server} ${language.events.voice.deafened}\``)
            } else {
                logEmbed.setDescription(`${newState.member.user.tag} ${language.events.voice.was} \`${language.events.voice.server} ${language.events.voice.undeafened}\``)
            }
        } else if(oldState.serverMute != newState.serverMute) { // Server Mute
            if(newState.serverMute) {
                logEmbed.setDescription(`${newState.member.user.tag} ${language.events.voice.was} \`${language.events.voice.server} ${language.events.voice.muted}\``)
            } else {
                logEmbed.setDescription(`${newState.member.user.tag} ${language.events.voice.was} \`${language.events.voice.server} ${language.events.voice.unmuted}\``)
            }
        } else if(oldState.selfDeaf != newState.selfDeaf) { // Self Deafen
            if(newState.selfDeaf) {
                logEmbed.setDescription(`${newState.member.user.tag} ${language.events.voice.has} \`${language.events.voice.deafened}\`.`)
            } else {
                logEmbed.setDescription(`${newState.member.user.tag} ${language.events.voice.has} \`${language.events.voice.undeafened}\`.`)
            };
        } else if(oldState.selfMute != newState.selfMute) { // Self Mute
            if(newState.selfMute) {
                logEmbed.setDescription(`${newState.member.user.tag} ${language.events.voice.has} \`${language.events.voice.muted}\`.`)
            } else {
                logEmbed.setDescription(`${newState.member.user.tag} ${language.events.voice.has} \`${language.events.voice.unmuted}\`.`)
            }
        } else if(oldState.selfVideo != newState.selfVideo) { // Self Video
            if(newState.selfVideo) {
                logEmbed.setDescription(`${newState.member.user.tag} ${language.events.voice.has} \`${language.events.voice.started}\`.`)
            } else {
                logEmbed.setDescription(`${newState.member.user.tag} ${language.events.voice.has} \`${language.events.voice.stopped}\`.`)
            }
        } else if(oldState.streaming != newState.streaming) { // Streaming
            if(newState.streaming) {
                logEmbed.setDescription(`${newState.member.user.tag} ${language.events.voice.has} \`${language.events.voice.stream}\`.`)
            } else {
                logEmbed.setDescription(`${newState.member.user.tag} ${language.events.voice.has} \`${language.events.voice.stopstream}\`.`)
            }
        } else if(newState.channelId == null) { // Channel Leave
            logEmbed.setDescription(`${oldState.member.user.tag} ${language.events.voice.has} ${language.events.voice.left} \`${oldChannel?.name}\`.`)
        } else if(oldState.channelId == null) { // Channel Join
            logEmbed.setDescription(`${oldState.member.user.tag} ${language.events.voice.has} ${language.events.voice.joined} \`${newChannel?.name}\`.`)
        } else if(oldState.channelId != newState.channelId){ // Channel Change
            logEmbed.setDescription(`${oldState.member.user.tag} ${language.events.voice.has} ${language.events.voice.moved} \`${oldChannel?.name}\` ${language.events.voice.to} \`${newChannel?.name}\`.`)
        } else {
            return;
        };
        await client.utils.sendLog(client, con, data, 'voicelogs', logEmbed);
    });
};