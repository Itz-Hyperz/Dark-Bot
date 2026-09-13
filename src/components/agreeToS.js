module.exports = async function(client, con, interaction, data, language) {
    let userid = interaction.message.embeds[0].footer.text
    if(interaction.user.id != userid) return interaction.reply({ content: `${language.components.agreeTos.notasked}, <@${userid}> ${language.components.agreeTos.notasked2}.`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    let buttonsupdated = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
            .setCustomId('agreeToS')
            .setLabel(`${language.components.agreeTos.agreed}`)
            .setStyle('PRIMARY')
            .setDisabled(true),
    )
    interaction.update({ components: [buttonsupdated] }).catch(e => {})
    interaction.message.channel.send({ content: `<@${interaction.user.id}> (${interaction.user.tag}) ${language.components.agreeTos.hasAgreed}.` }).catch(e => {})
}
