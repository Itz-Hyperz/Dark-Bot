module.exports = async function(client, con, interaction, data, language) {
    let guildListButtons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`SECONDARY`)
        .setLabel(`${language.globalButtons.back}`)
        .setCustomId('backGuilds')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`SECONDARY`)
        .setLabel(`${language.globalButtons.next}`)
        .setCustomId('nextGuilds')
    )
    if(client.config.botOwners.includes(interaction.user.id)) {
        guildListButtons.addComponents(
            new client.discord.MessageButton()
            .setStyle(`DANGER`)
            .setLabel(`${language.components.nextGuilds.buttons.leave}`)
            .setCustomId('forceLeaveGuild')
        )
    }
    await con.query(`SELECT * FROM guilds`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return;
        let curr = Number(interaction.message.embeds[0].footer.text) + 1;
        if(!row[curr]) curr = 0;
        let guild = await client.guilds.cache.get(row[curr].guildid);
        let owner = await client.users.fetch(guild?.ownerId);
        let guildList = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`${language.components.nextGuilds.title}`)
        .setDescription(`${language.components.nextGuilds.guildName} ${guild?.name}\n${language.components.nextGuilds.guildId} ${guild?.id}\n${language.components.nextGuilds.guildMembers} ${guild?.members?.cache?.size}\n\n${language.components.nextGuilds.guildOwnerTag} ${owner?.tag}\n${language.components.nextGuilds.guildOwnerId} ${owner?.id}`)
        .setTimestamp()
        .setFooter({ text: `${curr}` })
        try { guildList.setThumbnail(guild.iconURL({ dynamic: true })) } catch(e) {}
        interaction.update({ embeds: [guildList], components: [guildListButtons], ephemeral: client.config.commands.ephemeral }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};