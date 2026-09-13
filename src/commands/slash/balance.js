exports.run = async function(client, con, interaction, data, language) {
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.balance.deposit)
        .setStyle('SUCCESS')
        .setCustomId('bankingDeposit')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.balance.withdraw)
        .setStyle('DANGER')
        .setCustomId('bankingWithdraw')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.balance.transfer)
        .setStyle('PRIMARY')
        .setCustomId('bankingTransfer')
    )
    await con.query(`SELECT * FROM economyusers WHERE userid='${interaction.user.id}' AND guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            let embed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setAuthor({ name: `${interaction.user.tag} ${language.balance.bankingInfo}`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`${language.balance.wallet} ${data.currency}${row[0].balance}\n${language.balance.bank} ${data.currency}${row[0].bank}`)
            .setTimestamp()
            interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true }).catch(e => {})
        }
    });
};

exports.info = {
    "name": "balance",
    "description": "View your account balance."
}