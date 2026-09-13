exports.run = async function(client, con, interaction, data, language) {
    let options = [];
    await con.query(`SELECT * FROM applications WHERE guildid='${interaction.guild.id}' AND closed=false`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.apply.noAppsFound, ephemeral: true }).catch(e => {});
        await row.forEach(async (app) => {
            let obj = {
                label: app.appname,
                description: language.apply.clickToApply,
                value: app.uniqueid
            }
            options.push(obj);
        });
        let menu = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageSelectMenu()
            .setCustomId('appSelect')
            .setPlaceholder(language.apply.selectApp)
            .addOptions(options),
        )
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.apply.embedTitle)
        .setDescription(language.apply.embedDescription)
        .setTimestamp()
        await interaction.reply({ embeds: [embed], components: [menu], ephemeral: true }).catch(e => {});
    });
};

exports.info = {
    "name": "apply",
    "description": "Fill out an open application."
}