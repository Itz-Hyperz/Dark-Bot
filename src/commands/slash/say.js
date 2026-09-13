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
        let channel = await interaction.options.getChannel('channel')
        let input = await interaction.options.getString('message')
        await channel.send({ content: input }).catch(e => {
            if(client.config.debugmode) console.log(e);
        });
        await interaction.reply({ content: "Message Sent!", ephemeral: true }).catch(e => {});
    });
};

exports.info = {
    "name": "say",
    "description": "Make the bot say something.",
    "options": [
      {
        "name": "channel",
        "description": "The channel to post the message to.",
        "required": true,
        "type": "CHANNEL"
    },
      {
        "name": "message",
        "description": "The message to say.",
        "required": true,
        "type": "STRING"
      }
    ]
}