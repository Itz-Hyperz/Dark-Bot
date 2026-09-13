exports.run = async function(client, con, interaction, data, language) {

    let deUser = interaction.options.getUser('user')
    interaction.reply({ content: `${interaction.user.tag} ${language.hug.hasJustHugged} **<@${deUser.id}>**!` }).catch(e => {});

}

exports.info = {
    "name": "hug",
    "description": "Hug a user.",
    "options": [
      {
        "name": "user",
        "description": "The user to hug.",
        "required": true,
        "type": "USER"
      }
    ]
}