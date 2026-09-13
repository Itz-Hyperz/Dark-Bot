exports.run = async function(client, con, interaction, data, language) {
    let faxesCannotBeFucked = [];
    let refined = [];
    let count = 0;
    await con.query(`SELECT * FROM owneditems WHERE userid='${interaction.user.id}' AND guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.economy.inventory.emptyInventory, ephemeral: true }).catch(e => {});
        await row.forEach(r => {
            count++;
            faxesCannotBeFucked.push(`${count}) ${r.productName} +&${r.productId}+&`) // Because FAXES Cannot Be Fucked
        });
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor({ name: `${interaction.user.tag} ${language.economy.inventory.embedTitle}`, iconURL: client.user.displayAvatarURL() })
        .setDescription(`${language.economy.inventory.selectItem}`)
        .setTimestamp()

        await faxesCannotBeFucked.forEach(async (i) => {
            let obj = {
                label: i.split('+&')[0],
                description: language.economy.inventory.clickToUse,
                value: i.split('+&')[1].replaceAll('+&', '')
            };
            refined.push(obj)
        });

        let base = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageSelectMenu()
                .setCustomId('inventorySelect')
                .setPlaceholder(language.economy.inventory.selectAction)
                .addOptions(refined),
        );

        await interaction.reply({ embeds: [embed], components: [base, client.refreshButton], ephemeral: true }).catch(e => {})
    });
};

exports.info = {
    "name": "inventory",
    "description": "View your user inventory."
}