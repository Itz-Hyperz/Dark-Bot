const figlet = require('figlet')
exports.run = async function(client, con, interaction, data, language) {
    let ans = interaction.options.getString('text');
    figlet.text(ans, { width: `900`}, async function(err, head) {
        if(err) throw err;
        await interaction.reply({ content: `\`\`\`\n${head}\n\`\`\``, ephemeral: client.config.commands.ephemeral }).catch(e => {});
    });
}

exports.info = {
    "name": "ascii",
    "description": "Create ascii text.",
    "options": [
      {
        "name": "text",
        "description": "The text to convert to ascii.",
        "required": true,
        "type": "STRING"
      }
    ]
}