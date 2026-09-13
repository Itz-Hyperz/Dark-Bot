const ms = require('ms')
exports.run = async function(client, con, interaction, data, language) {

    let time = interaction.options.getString('time')
    let reason = interaction.options.getString('reason')
    let channel = interaction.channel;

    let embed1 = new client.discord.MessageEmbed()
    .setColor(data.themecolor || '#FFFFFF')
    .setTitle(language.timer.set)
    .setAuthor({ name: `${interaction.user.tag}'s ${language.timer.timer}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setDescription(`${language.timer.remind} \`${time}\` ${language.timer.to} \`${reason}\``)
    .setTimestamp()
    

    let embed2 = new client.discord.MessageEmbed()
    .setColor(data.themecolor || '#FFFFFF')
    .setTitle(language.timer.up)
    .setAuthor({ name: `${interaction.user.tag}'s ${language.timer.timer}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setDescription(`${language.timer.time}\`${time}\`\n${language.timer.note}\`${reason}\``)
    .setTimestamp()
    

    await interaction.reply({ embeds: [embed1] }).catch(e => {})

    setTimeout(async () => {
        await interaction.editReply({ content: language.timer.ended, embeds: [embed2] }).catch(e => {})
        await interaction.channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed2] }).catch(e => {});
    }, ms(time));

}

exports.info = {
    "name": "timer",
    "description": "Set a timer.",
    "options": [
      {
        "name": "time",
        "description": "The time for the timer to go off. (Ex: 1h = 1 hour, 1m = 1 minute, 5s = 5 seconds)",
        "required": true,
        "type": "STRING"
    },
      {
        "name": "reason",
        "description": "What should the bot remind you about?",
        "required": true,
        "type": "STRING"
      }
    ]
}