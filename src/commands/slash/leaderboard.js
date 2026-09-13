exports.run = async function(client, con, interaction, data, language) {

    if(!data.leveling) return interaction.reply({ content: language.leveling.disabled, ephemeral: client.config.commands.ephemeral }).catch(e => {});

    let index = 0;
    let poop = [];
    let top15users = "";

    await con.query(`SELECT * FROM chatlvl WHERE guildid='${interaction.guild.id}' ORDER BY userxp DESC LIMIT 15`, async (err, row) => {
        row.forEach(u => {
            let t = interaction.guild.members.cache.find(p => p.id == u.userid);
            if(t) {
                poop.push({chatInfo: u, username: t.user.tag});
            } else {
                poop.push({chatInfo: u, username: language.leveling.unknownUser});
            }
        });

        poop.forEach(Y => {
            index++;
            if(index < 10) index = `0${index}`;
            if (index == 1) {
                top15users += `\`${index}.\` :first_place: ${language.leveling.lvl} ${Y.chatInfo.userlvl} ${language.leveling.xp} ${Y.chatInfo.userxp} - ${Y.username}\n`
            } else if (index == 2) {
                top15users+= `\`${index}.\` :second_place: ${language.leveling.lvl} ${Y.chatInfo.userlvl} ${language.leveling.xp} ${Y.chatInfo.userxp} - ${Y.username}\n`
            } else if (index == 3) {
                top15users+= `\`${index}.\` :third_place: ${language.leveling.lvl} ${Y.chatInfo.userlvl} ${language.leveling.xp} ${Y.chatInfo.userxp} - ${Y.username}\n`
            } else if ( index <= 15 ) {
                top15users+= `\`${index}.\` :checkered_flag: ${language.leveling.lvl} ${Y.chatInfo.userlvl} ${language.leveling.xp} ${Y.chatInfo.userxp} - ${Y.username}\n`
            }
        });

        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`__${interaction.guild.name}__ ${language.leveling.embedTitle}`)
        .setThumbnail(interaction.guild.iconURL({dynamic: true}))
        .setDescription(top15users)
        .setFooter({ text: `${language.leveling.requestedBy} ${interaction.user.tag}` })
        await interaction.reply({ embeds: [embed], ephemeral: client.config.commands.ephemeral }).catch(e => {});

    });

};

exports.info = {
    "name": "leaderboard",
    "description": "View this servers chat level leaderboard."
}