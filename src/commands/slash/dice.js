exports.run = async function(client, con, interaction, data, language) {
    const dice = language.dice.numbers;
    let answer = await client.utils.maths(dice)
    await interaction.reply({ content: `${language.dice.landedOn} ${answer}`, ephemeral: client.config.commands.ephemeral }).catch(e => {});
}

exports.info = {
    "name": "dice",
    "description": "Roll the dice."
}