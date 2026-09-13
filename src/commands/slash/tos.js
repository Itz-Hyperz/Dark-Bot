exports.run = async function(client, con, interaction, data, language) {
    let deUser = await interaction.options.getUser('user');
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="tickets" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(e => {});
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(e => {});
        let buttons = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
                .setCustomId('agreeToS')
                .setLabel(language.tos.agree)
                .setStyle('PRIMARY')
        )
        let embed = new client.discord.MessageEmbed()
        .setAuthor({ name: deUser.tag, iconURL: deUser.avatarURL({ dynamic: true }) })
        .setTitle(language.tos.tos)
        .setURL(data.toslink)
        .setColor(data.themecolor || '#FFFFFF')
        .setDescription(`${language.tos.confirm}(${data.toslink})${language.tos.confirm2}`)
        .setFooter({ text: deUser.id })
        .setTimestamp()
        try { embed.setThumbnail(interaction.guild.iconURL({ dynamic: true })) } catch(e) {}

        await interaction.reply({ embeds: [embed], components: [buttons] })
    });
};

exports.info = {
    "name": "tos",
    "description": "Ask a user to agree to your terms of service.",
    "options": [
      {
        "name": "user",
        "description": "The user you wish to ask to agree to your Terms of Service.",
        "required": true,
        "type": "USER"
      }
    ]
}