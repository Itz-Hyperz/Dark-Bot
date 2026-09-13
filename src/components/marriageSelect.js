module.exports = async function(client, con, interaction, data, language) {
    let selection = interaction.values[0];
    let menu = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageSelectMenu()
        .setCustomId('marriageSelect')
        .setPlaceholder(`${language.components.marriageSelect.place}`)
        .addOptions([
            {
                label: language.components.marriageSelect.buttons.request.label,
                description: language.components.marriageSelect.buttons.request.desc,
                value: 'sendrequest',
            },
            {
                label: language.components.marriageSelect.buttons.accept.label,
                description: language.components.marriageSelect.buttons.accept.desc,
                value: 'acceptproposal',
            },
            {
                label: language.components.marriageSelect.buttons.deny.label,
                description: language.components.marriageSelect.buttons.deny.desc,
                value: 'denyproposal',
            },
            {
                label: language.components.marriageSelect.buttons.divorce.label,
                description: language.components.marriageSelect.buttons.divorce.desc,
                value: 'divorce',
            }
        ]),
    )
    if(selection == 'sendrequest') {
        require('./marriageSendRequest.js')(client, con, interaction, data, menu, language);
    } else if(selection == 'acceptproposal') {
        require('./marriageAcceptProposal.js')(client, con, interaction, data, menu, language);
    } else if(selection == 'denyproposal') {
        require('./marriageDenyProposal.js')(client, con, interaction, data, menu, language);
    } else if(selection == 'divorce') {
        require('./marriageDivorce.js')(client, con, interaction, data, menu, language);
    };
};