exports.run = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM ticketcategories WHERE guildid="${interaction.guild.id}"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.tickets.noTickets, ephemeral: true }).catch(e => {});
        let refined = [];
        row.forEach(async (c) => {
            let obj = {
                label: `🎫 ${c.catname}`,
                description: c.catdesc,
                value: c.uniqueid
            };
            refined.push(obj);
        });
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(language.tickets.embedTitle)
        .setDescription(language.tickets.embedDesc)
        .setTimestamp()
        let menu = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageSelectMenu()
                .setCustomId('ticketSelect')
                .setPlaceholder(language.tickets.selectAction)
                .addOptions(refined),
        );
        await interaction.reply({ embeds: [embed], components: [menu], ephemeral: true }).catch(e => {});
    });
};

exports.info = {
    "name": "ticket",
    "description": "Create a ticket."
}