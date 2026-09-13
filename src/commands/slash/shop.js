exports.run = async function(client, con, interaction, data, language) {
    let faxesCannotBeFucked = [];
    let refined = [];
    let count = 0;
    await con.query(`SELECT * FROM shop WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.shop.empty, ephemeral: true }).catch(e => {});
        await row.forEach(r => {
            count++;
            faxesCannotBeFucked.push(`${count}) **${r.productName}** [${r.productPrice}] +&${r.productId}+&`) // Because FAXES Cannot Be Fucked
        });
        let embed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor({ name: `${interaction.guild.name} ${language.shop.shop}`, iconURL: client.user.displayAvatarURL() })
        .setDescription(`${language.shop.select}`)
        .setTimestamp()

        await faxesCannotBeFucked.forEach(async (i) => {
            let p = i.split('+&')[1].replaceAll('+&', '');
            let t = i.replaceAll('*', '').split(']')[0];
            let obj = {
                label: `${t}.00]`,
                description: language.shop.click,
                value: p
            };
            refined.push(obj)
        });

        let base = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageSelectMenu()
                .setCustomId('shopSelect')
                .setPlaceholder(language.shop.selectAction)
                .addOptions(refined),
        );

        await interaction.reply({ embeds: [embed], components: [base, client.refreshButton], ephemeral: true }).catch(e => {})
    });
};

exports.info = {
    "name": "shop",
    "description": "View the shop or make a purchase."
}