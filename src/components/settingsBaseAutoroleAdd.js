module.exports = async function(client, con, interaction, data, language) {
    await interaction.reply({ content: language.components.settingsBaseAutoroleAdd.mention, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
    let q = language.components.settingsBaseAutoroleAdd.q;
    let lol = 0;
    let r;
    let o;
    collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.settingsBaseAutoroleAdd.cancel, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.settingsBaseAutoroleAdd.cancel, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
        lol++
        await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        if(lol == 1) {
            interaction.editReply({ content: q }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            if(m.mentions.roles.first()) {
                r = m.mentions.roles.first().id;
            } else if (!isNaN(m.content)) {
                r = m.content;
            } else {
                interaction.editReply({ content: language.components.provide, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return;
            }
        } else if(lol == 2) {
            if(m.content.toLowerCase() == "1") {
                o = false;
            } else if(m.content.toLowerCase() == "2") {
                o = true;
            } else {
                interaction.editReply({ content: language.components.settingsBaseAutoroleAdd.provide1, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return;
            }
        };
        if(lol >= 2) {
            await con.query(`INSERT INTO autoroles (guildid, roleid, verify) VALUES ("${interaction.guild.id}", "${r}", ${o})`, async (err, row) => {
                if(err) throw err;
                interaction.editReply({ content: `${language.components.settingsBaseAutoroleAdd.added}\n<@&${r}>`, ephemeral: true })
                collector.stop();
                return;
            });
        };
    });
};