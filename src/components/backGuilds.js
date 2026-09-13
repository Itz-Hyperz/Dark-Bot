module.exports = async function(client, con, interaction, data, language) {
    let guildListButtons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`SECONDARY`)
        .setLabel(language.globalButtons.back)
        .setCustomId('backGuilds')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`SECONDARY`)
        .setLabel(language.globalButtons.next)
        .setCustomId('nextGuilds')
    )
    if(client.config.botOwners.includes(interaction.user.id)) {
        guildListButtons.addComponents(
            new client.discord.MessageButton()
            .setStyle(`DANGER`)
            .setLabel(language.components.guilds.leaveGuild)
            .setCustomId('forceLeaveGuild')
        )
    }
    await con.query(`SELECT * FROM guilds`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return;
        let curr = Number(interaction.message.embeds[0].footer.text) - 1;
        if(!row[curr]) curr = 0;
        let guild = await client.guilds.cache.get(row[curr].guildid);
        if(guild == undefined) return;
        let owner = await client.users.fetch(guild.ownerId);
        if(owner == undefined) return;
        let guildList = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.components.guilds.embedTitle)
        .setDescription(`${language.components.guilds.embedGuildName} ${guild.name}\n${language.components.guilds.embedGuildId} ${guild.id}\n${language.components.guilds.embedGuildMembers} ${guild.members.cache.size}\n\n${language.components.guilds.embedGuildOwnerTag} ${owner.tag}\n${language.components.guilds.embedGuildOwnerId} ${owner.id}`)
        .setTimestamp()
        .setFooter({ text: `${curr}` })
        try { guildList.setThumbnail(guild.iconURL({ dynamic: true })) } catch(e) {}
        interaction.update({ embeds: [guildList], components: [guildListButtons], ephemeral: client.config.commands.ephemeral }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};