exports.run = async function(client, con, interaction, data, language) {

    let deUser = interaction.options.getUser('user')

    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="info" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(e => {});
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(e => {});
        await con.query(`SELECT * FROM chatlvl WHERE userid='${deUser.id}' AND guildid='${interaction.guild.id}'`, async (err, row) => {
            if(err) throw err;
            let lol;
            if(row[0]) {
                lol = row[0].userlvl
            } else {
                lol = 0
            }
            await con.query(`SELECT COUNT(caseid) as total FROM cases WHERE userid='${deUser.id}' AND guildid='${interaction.guild.id}'`, async (err, row) => {
                if(err) throw err;
                let cringe;
                if(row[0]) {
                    cringe = row[0].total
                } else {
                    cringe = 0
                }
                    let embed = new client.discord.MessageEmbed()
                    .setColor(data.themecolor || '#FFFFFF')
                    .setAuthor({ name: language.user.info, iconURL: deUser.avatarURL({dynamic: true}) })
                    .setThumbnail(deUser.displayAvatarURL({dynamic: true}))
                    .addFields(
                        { name: `${language.user.tag}:`, value: `${deUser.tag}`, inline: true},
                        { name: `${language.user.id}:`, value: `${deUser.id}\n`, inline: true},
                        { name: `${language.user.bot}:`, value: `${deUser.bot}`, inline: true},
                        { name: `${language.user.cases}:`, value: `${cringe}`, inline: true},
                        { name: `${language.user.level}:`, value: `${lol}`, inline: true},
                        { name: `${language.user.joined}:`, value: `\`\`\`${deUser.createdAt.toLocaleString()}\`\`\``},
                    )
                    .setTimestamp()
                    .setFooter({ text: `${language.user.requestedBy} ${interaction.user.tag}` })

                    await interaction.reply({ embeds: [embed], ephemeral: client.config.commands.ephemeral }).catch(e => {});
            });
        });
    });

}

exports.info = {
    "name": "user",
    "description": "View a users information.",
    "options": [
      {
        "name": "user",
        "description": "The user to view.",
        "required": true,
        "type": "USER"
      }
    ]
}