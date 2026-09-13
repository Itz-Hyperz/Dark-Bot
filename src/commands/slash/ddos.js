exports.run = async function(client, con, interaction, data, language) {

    let array = ["A", "B", "C", "D", "E", "F", "G"];
    let random = client.utils.maths(array)

    let user = interaction.options.getUser('target')

    interaction.reply({ content: `${language.ddos.sending} ${user}` }).catch(e => {});

    if(random == "A") {
        setTimeout(() => {
            interaction.editReply({ content: `\`\`\`fix\n${language.ddos.successful}\n\`\`\`` }).catch(e => {});
        }, 5000)
    } else {
        setTimeout(() => {
            interaction.editReply({ content: language.ddos.lag }).catch(e => {});
        }, 5000)
    
        setTimeout(() => {
            interaction.editReply({ content: language.ddos.no }).catch(e => {});
        }, 10000)
    
        setTimeout(() => {
            interaction.editReply({ content: language.ddos.failure }).catch(e => {});
        }, 15000)
    }
    

}

exports.info = {
    "name": "ddos",
    "description": "Send a DDOS attack 😉!",
    "options": [
      {
        "name": "target",
        "description": "The user to \"attack\".",
        "required": true,
        "type": "USER"
      }
    ]
}