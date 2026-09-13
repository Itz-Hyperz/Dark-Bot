module.exports = async function(client, con, interaction, data, language) {
    await interaction.reply({ content: language.components.clientAdd.user, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
    let input;
    collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.birthdayAdd.cancel, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.birthdayAdd.cancel, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
        if(m.mentions.users.first()) {
            input = m.mentions.users.first().id;
        } else if(!isNaN(m.content)) {
            let user = await client.users.fetch(m.content);
            if(user == undefined) return interaction.editReply({ content: language.components.clientAdd.iUser, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            input = user.id;
        } else {
            return interaction.editReply({ content: language.components.clientAdd.iUser, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        }
        input = input.replaceAll('"', '');
        input = input.replaceAll("`", "");
        await con.query(`SELECT * FROM clients WHERE guildid="${interaction.guild.id}" AND userid="${input}"`, async (err, row) => {
            if(err) throw err;
            if(row[0]) return interaction.editReply({ content: language.components.clientAdd.already, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            await con.query(`SELECT COUNT(uniqueid) as total FROM clients WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
                if(err) throw err;
                let count = row[0]?.total;
                await con.query(`INSERT INTO clients (guildid, userid, uniqueid) VALUES ("${interaction.guild.id}", "${input}", "${count + 1}")`, async (err, row) => {
                    if(err) throw err;
                    await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    let user = await client.users.fetch(input);
                    let found = interaction.guild.members.cache.get(input);
                    if(found != undefined) {
                        await con.query(`SELECT * FROM perms WHERE guildid='${interaction.guild.id}' AND permtype='customers'`, async (err, row) => {
                            if(err) throw err;
                            await row.forEach(async (r) => {
                                await found.roles.add(r.roleid).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                            });
                        });
                    };
                    let logembed = new client.discord.MessageEmbed()
                    .setColor(data.themecolor || '#FFFFFF')
                    .setTitle(language.components.clientAdd.added)
                    .setDescription(`**${user.tag}** ${language.components.clientAdd.done}`)
                    .setTimestamp()
                    client.utils.sendLog(client, con, data, 'clientlogs', logembed);
                    await interaction.editReply({ content: language.components.clientAdd.add }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    collector.stop();
                    return;
                });
            });
        });
    });
};