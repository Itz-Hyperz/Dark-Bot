exports.run = async function(client, con, interaction, data, language) {
    let suggestion = await interaction.options.getString('suggestion');
    let embed = new client.discord.MessageEmbed()
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setColor(data.themecolor || '#FFFFFF')
    .setTitle(language.suggestion.embedTitle)
    .setDescription(suggestion)
    .setTimestamp()
    await interaction.reply({ content: language.suggestion.recieved, ephemeral: true });
    await con.query(`SELECT * FROM channels WHERE guildid='${interaction.guild.id}' AND channeltype='suggestlogs'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.editReply({ content: language.suggestion.noChan }).catch(e => {});
        await row.forEach(async (r) => {
            let channel = await client.channels.cache.get(r.channelid);
            if(channel != undefined) {
                await channel.send({ embeds: [embed] }).then(async (msg) => {
                    await msg.react('👍').catch(e => {});
                    await msg.react('👎').catch(e => {});
                }).catch(e => {
                    if(client.config.debugmode) console.log(e);
                });
            };
        });
    });
};

exports.info = {
    "name": "suggest",
    "description": "Leave a suggestion.",
    "options": [
      {
        "name": "suggestion",
        "description": "What you are suggesting.",
        "required": true,
        "type": "STRING"
      }
    ]
}