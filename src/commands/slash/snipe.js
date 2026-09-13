exports.run = async function(client, con, interaction, data, language) {
    let msg = client.snipes.get(interaction.channel.id)
    if(!msg) return interaction.reply({ content: language.snipe.noMessage, ephemeral: true }).catch(e => {});
    let embed = new client.discord.MessageEmbed()
    .setColor(data.themecolor || '#FFFFFF')
    .setAuthor({ name: `${language.snipe.messageFrom} ${msg.author}`, iconURL: msg.member.user.avatarURL({dynamic: true}) })
    .setDescription(`${msg.content}`)
    .setFooter({ text: `${language.snipe.snipedBy} ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({dynamic: true}) })
    await interaction.reply({ embeds: [embed], ephemeral: client.config.commands.ephemeral }).catch(e => {});
};

exports.info = {
    "name": "snipe",
    "description": "Fetch the last deleted message in this channel."
}