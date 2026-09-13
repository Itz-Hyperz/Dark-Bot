exports.run = async function(client, con, interaction, data, language) {
    let array = [];
    await con.query(`SELECT * FROM clients WHERE guildid='${interaction.guild.id}' ORDER BY uniqueid ASC`, async (err, rows) => {
        if(err) throw err;
        if(!rows[0]) return interaction.reply({ content: language.clients.noClients, ephemeral: true }).catch(e => {});
        await rows.forEach(async r => {
            let user = await client.users.fetch(r.userid)
            array.push(`**${r.uniqueid}.** ${user?.tag}`)
        });
        let final = array.join('\n')
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`${interaction.guild.name} ${language.clients.clients}`)
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setDescription(final)
        .setTimestamp()
        await interaction.reply({ embeds: [embed], ephemeral: client.config.commands.ephemeral }).catch(e => {});
    });
};

exports.info = {
    "name": "clients",
    "description": "View this guilds clients."
}