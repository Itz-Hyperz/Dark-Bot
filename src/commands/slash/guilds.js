exports.run = async function(client, con, interaction, data, language) {
    let buttons = new client.discord.MessageActionRow()
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
        buttons.addComponents(
            new client.discord.MessageButton()
            .setStyle(`DANGER`)
            .setLabel(language.guilds.leaveGuild)
            .setCustomId('forceLeaveGuild')
        )
    }
    await con.query(`SELECT * FROM guilds`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return;
        let guild = await client.guilds.cache.get(row[0].guildid);
        if(guild == undefined) return;
        let owner = await client.users.fetch(guild.ownerId);
        if(owner == undefined) return;
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.guilds.embedTitle)
        .setDescription(`${language.guilds.embedGuildName} ${guild.name}\n${language.guilds.embedGuildId} ${guild.id}\n${language.guilds.embedGuildMembers} ${guild.members.cache.size}\n\n${language.guilds.embedGuildOwnerTag} ${owner.tag}\n${language.guilds.embedGuildOwnerId} ${owner.id}`)
        .setTimestamp()
        .setFooter({ text: '0' })
        try { embed.setThumbnail(guild.iconURL({ dynamic: true })) } catch(e) {}
        interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true }).catch(e => {});
    });

}

exports.info = {
    "name": "guilds",
    "description": "See the guilds this bot is in."
}