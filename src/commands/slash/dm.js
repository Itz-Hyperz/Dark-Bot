exports.run = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="mod" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(e => {});
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(e => {});
        let user = await interaction.options.getUser('user')
        let message = await interaction.options.getString('message')
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.dm.embedTitle)
        .setDescription(`${message}`)
        .setTimestamp()
        user.send({ embeds: [embed] }).then(() => {
            interaction.reply({ content: language.dm.messageSent, ephemeral: true }).catch(e => {});
        }).catch(e => {
            interaction.reply({ content: `${language.dm.messageSentFailed}\n${language.dm.dmsOff}`, ephemeral: true }).catch(e => {});
        });
    });
};

exports.info = {
    "name": "dm",
    "description": "Privately message a user as the bot.",
    "options": [
      {
        "name": "user",
        "description": "The user to message.",
        "required": true,
        "type": "USER"
    },
      {
        "name": "message",
        "description": "The message to send them.",
        "required": true,
        "type": "STRING"
      }
    ]
}