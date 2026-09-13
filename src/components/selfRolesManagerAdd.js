module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text);
    let uniqueid = interaction.message.embeds[0].author.name;
    await interaction.reply({ content:language.components.selfRolesManagerAdd.provide, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
    let role;
    collector.on('collect', async (m) => {
        if(m.content.toLowerCase() == language.cancel) {
            await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            collector.stop();
            return interaction.reply({ content: language.components.selfRolesManagerAdd.cancel, ephemeral: true }).catch(e => {
                interaction.editReply({ content: language.components.selfRolesManagerAdd.cancel, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            });
        };
        if(m.mentions.roles.first()) {
            role = await interaction.guild.roles.fetch(m.mentions.roles.first().id);
        } else if(!isNaN(m.content)) {
            role = await interaction.guild.roles.fetch(m.content);
        } else {
            interaction.reply({ content: language.components.selfRolesManagerAdd.provide2, ephemeral: true }).catch(e => {})
            return;
        };
        await con.query(`INSERT INTO selfroles (guildid, panelid, roleid, rolename) VALUES ("${interaction.guild.id}", "${uniqueid}", "${role.id}", "${role.name}")`, async (err, row) => {
            if(err) throw err;
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            interaction.editReply({ content: language.components.selfRolesManagerAdd.created, ephemeral: true })
            collector.stop();
            return;
        });
    });
};