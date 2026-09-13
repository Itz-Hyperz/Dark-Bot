module.exports = async function(client, con, interaction, data, language) {
    await interaction.reply({ content: `${language.components.ticketAdd.a}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 1500000 });
    let c = 0;
    let uniqueid = await client.utils.makeid(14);
    let guildid = interaction.guild.id;
    let catid;
    let catname;
    let catdesc;
    collector.on('collect', async (m) => {
        if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: `${language.components.ticketAdd.b}`, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: `${language.components.ticketAdd.b}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
        c++;
        if(c == 1) {
            catname = m.content;
            catname = catname.replaceAll('"', '');
            catname = catname.replaceAll("`", "");
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            await interaction.editReply({ content: `${language.components.ticketAdd.c}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        } else if(c == 2) {
            catdesc = m.content;
            catdesc = catdesc.replaceAll('"', '');
            catdesc = catdesc.replaceAll("`", "");
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            await interaction.editReply({ content: `${language.components.ticketAdd.d}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        } else if(c == 3) {
            if(m.mentions.channels.first()) {
                catid = m.mentions.channels.first().parentId;
            } else {
                catid = m.content;
            }
            catid = catid.replaceAll('"', '');
            catid = catid.replaceAll("`", "");
            await con.query(`INSERT INTO ticketcategories (guildid, uniqueid, catid, catname, catdesc) VALUES ("${guildid}", "${uniqueid}", "${catid}", "${catname}", "${catdesc}")`, async (err, row) => {
                if(err) throw err;
                await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                await interaction.editReply({ content: `${language.components.ticketAdd.e}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return;
            });
        }
    });
};