exports.run = async function(client, con, interaction, data, language) {

    if(!data.leveling) return interaction.reply({ content: language.leveling.disabled, ephemeral: client.config.commands.ephemeral }).catch(e => {});

    let deUser = interaction.options.getUser('user')
    await con.query(`SELECT * FROM chatlvl WHERE userid='${deUser.id}' AND guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            let embed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setTitle(language.leveling.levelCommand.embedTitle)
            .setThumbnail(`${deUser.avatarURL({dynamic: true})}`)
            .setDescription(`${language.leveling.levelCommand.currentXp} ${row[0].userxp.toLocaleString()}\n${language.leveling.levelCommand.currentLevel} ${row[0].userlvl.toLocaleString()}`)
            .setFooter({ text: `${language.leveling.requestedBy} ${interaction.user.tag}` })
            await interaction.reply({ embeds: [embed], ephemeral: client.config.commands.ephemeral }).catch(e => {});
        } else {
            await interaction.reply({ content: language.leveling.levelCommand.noLevelData, ephemeral: client.config.commands.ephemeral }).catch(e => {});
        }
    });
};

exports.info = {
    "name": "level",
    "description": "View a users level.",
    "options": [
      {
        "name": "user",
        "description": "The user to view the level of",
        "required": true,
        "type": "USER"
      }
    ]
}