module.exports = async function(client, con, interaction, data, language) {
    await interaction.reply({ content: "Please define the channel to create the sticky message in.", ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
    let channel;
    let input;
    let c = 0;
    collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: `${language.components.stickyAdd.a}`, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: `${language.components.stickyAdd.a}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
        c++;
        if(c == 1) {
            if(m.mentions.channels.first()) {
                channel = m.mentions.channels.first().id;
                channel = channel.replaceAll('"', '');
                channel = channel.replaceAll("`", "");
                await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                await con.query(`SELECT * FROM stickymsgs WHERE guildid='${interaction.guild.id}' AND channel='${channel}'`, async (err, row) => {
                    if(err) throw err;
                    if(row[0]) {
                        c = 0;
                        await interaction.editReply({ content: `${language.components.stickyAdd.b}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    } else {
                        await interaction.editReply({ content: `${language.components.stickyAdd.c}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    };
                });
            } else if(!isNaN(m.content)) {
                channel = m.content;
                channel = channel.replaceAll('"', '');
                channel = channel.replaceAll("`", "");
                await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                await con.query(`SELECT * FROM stickymsgs WHERE guildid='${interaction.guild.id}' AND channel='${channel}'`, async (err, row) => {
                    if(err) throw err;
                    if(row[0]) {
                        c = 0;
                        await interaction.editReply({ content: `${language.components.stickyAdd.b}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    } else {
                        await interaction.editReply({ content: `${language.components.stickyAdd.c}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    };
                });
            } else {
                await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                await interaction.editReply({ content: `${language.components.stickyAdd.d}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                return;
            };
        } else if(c == 2) {
            input = m.content;
            input = input.replaceAll('"', '');
            input = input.replaceAll("`", "");
            await con.query(`INSERT INTO stickymsgs (guildid, channel, response) VALUES ("${interaction.guild.id}", "${channel}", "${input}")`, async (err, row) => {
                if(err) throw err;
                await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                await interaction.editReply({ content: `${language.components.stickyAdd.e}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return;
            });
        }
    });
};