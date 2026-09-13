exports.run = async function(client, con, interaction, data, language) {

    let deUser = interaction.options.getUser('user');

    let embed = new client.discord.MessageEmbed()
    .setColor(data.themecolor || '#FFFFFF')
    .setTitle(`${deUser.username}'s ${language.avatar}`)
    .setImage(deUser.avatarURL({ dynamic: true }))
    .setTimestamp()
    
    interaction.reply({ embeds: [embed], ephemeral: client.config.commands.ephemeral }).catch(e => {});

}

exports.info = {
    "name": "avatar",
    "description": "Get a users avatar.",
    "options": [
      {
        "name": "user",
        "description": "The user to get the avatar of.",
        "required": true,
        "type": "USER"
      }
    ]
}