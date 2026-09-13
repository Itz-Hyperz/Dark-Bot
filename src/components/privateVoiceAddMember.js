module.exports = async function(client, con, interaction, data, language) {
    let channelid = interaction.message.embeds[0].footer.text
    await interaction.reply({ content: language.vcAddMemberText }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    con.query(`SELECT * FROM privatecalls WHERE uniqueid="${channelid}"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.vcNoChannel }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let channeldata = row[0];
        let channel = await client.channels.cache.get(channelid);
        const filter = (m) => m.author.id == interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
        collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                collector.stop();
                return interaction.reply({ content: language.components.settingsBasePrivateVCCatUpdate.cancelled, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.settingsBasePrivateVCCatUpdate.cancelled, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
            let input;
            if(m.mentions.users.first()) {
                input = m.mentions.users.first().id;
            } else if(!isNaN(m.content)) {
                input = m.content;
            } else {
                collector.stop();
                return interaction.reply({ content: language.components.settingsBasePrivateVCCatUpdate.cancelled, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.settingsBasePrivateVCCatUpdate.cancelled, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
            let guild = await client.guilds.cache.get(channeldata.guildid);
            let everyoneRole = await guild.roles.cache.find(role => role.name === "@everyone");
            let permissionOverwriteArray = [
                {
                    id: interaction.user.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS']
                },
                {
                    id: everyoneRole.id,
                    deny: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS']
                },
                {
                    id: client.user.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS']
                }
            ];
            let parsed = JSON.parse(channeldata.alloweduserids);
            parsed.push(input);
            for(let item of parsed) {
                permissionOverwriteArray.push({
                    id: item,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM']
                });
            };
            let allowed = JSON.stringify(parsed);
            await channel.permissionOverwrites.set(permissionOverwriteArray);
            await con.query(`UPDATE privatecalls SET alloweduserids='${allowed}' WHERE uniqueid='${channelid}'`, async (err, row) => {
                if(err) throw err;
                interaction.editReply({ content: language.vcAddSuccess })
                collector.stop();
                return;
            });
        });
    });
}