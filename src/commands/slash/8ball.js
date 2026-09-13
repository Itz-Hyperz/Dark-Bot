exports.run = async function(client, con, interaction, data, language) {
    const responses = language.eightBallResponses
    let answer = await client.utils.maths(responses)
    interaction.reply({ content: `${language.eightBallCommand} ${answer}`, ephemeral: client.config.commands.ephemeral }).catch(e => {});

}

exports.info = {
    "name": "8ball",
    "description": "Talk to god.",
    "options": [
      {
        "name": "question",
        "description": "The question to ask the 🎱 ball.",
        "required": true,
        "type": "STRING"
      }
    ]
}