/*
    CHANNEL TYPES:
    welcome
    leave
    membercount
    usercount
    channellogs
    rolelogs
    modlogs
    ticketlogs
    messagelogs
    commandlogs
    altprevlogs
    dmlogs
    serverlocklogs
    birthdaylogs
    filterlogs
    applicationlogs
    leveluplogs
    otherlogs
*/
module.exports = async function(client, con, interaction, data, language) {
    let gohome = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(`${language.globalButtons.home}`)
        .setStyle('SECONDARY')
        .setCustomId('loggingHome')
    )
    let base = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageSelectMenu()
            .setCustomId('loggingSelect')
            .setPlaceholder(`${language.components.loggingSelect.selectPlaceHolder}`)
            .addOptions([
                {
                    label: language.components.loggingSelect.options.welcome.label,
                    description: language.components.loggingSelect.options.welcome.desc,
                    value: 'welcome',
                },
                {
                    label: language.components.loggingSelect.options.leave.label,
                    description: language.components.loggingSelect.options.leave.desc,
                    value: 'leave',
                },
                {
                    label: language.components.loggingSelect.options.member.label,
                    description: language.components.loggingSelect.options.member.desc,
                    value: 'membercount',
                },
                {
                    label: language.components.loggingSelect.options.user.label,
                    description: language.components.loggingSelect.options.user.desc,
                    value: 'usercount',
                },
                {
                    label: language.components.loggingSelect.options.channel.label,
                    description: language.components.loggingSelect.options.channel.desc,
                    value: 'channellogs',
                },
                {
                    label: language.components.loggingSelect.options.role.label,
                    description: language.components.loggingSelect.options.role.desc,
                    value: 'rolelogs',
                },
                {
                    label: language.components.loggingSelect.options.mod.label,
                    description: language.components.loggingSelect.options.mod.desc,
                    value: 'modlogs',
                },
                {
                    label: language.components.loggingSelect.options.ticket.label,
                    description: language.components.loggingSelect.options.ticket.desc,
                    value: 'ticketlogs',
                },
                {
                    label: language.components.loggingSelect.options.message.label,
                    description: language.components.loggingSelect.options.message.desc,
                    value: 'messagelogs',
                },
                {
                    label: language.components.loggingSelect.options.command.label,
                    description: language.components.loggingSelect.options.command.desc,
                    value: 'commandlogs',
                },
                {
                    label: language.components.loggingSelect.options.voice.label,
                    description: language.components.loggingSelect.options.voice.desc,
                    value: 'voicelogs',
                },
                {
                    label: language.components.loggingSelect.options.alt.label,
                    description: language.components.loggingSelect.options.alt.desc,
                    value: 'altprevlogs',
                },
                {
                    label: language.components.loggingSelect.options.server.label,
                    description: language.components.loggingSelect.options.server.desc,
                    value: 'serverlocklogs',
                },
                {
                    label: language.components.loggingSelect.options.filter.label,
                    description: language.components.loggingSelect.options.filter.desc,
                    value: 'filterlogs',
                },
                {
                    label: language.components.loggingSelect.options.client.label,
                    description: language.components.loggingSelect.options.client.desc,
                    value: 'clientlogs',
                },
                {
                    label: language.components.loggingSelect.options.review.label,
                    description: language.components.loggingSelect.options.review.desc,
                    value: 'reviewlogs',
                },
                {
                    label: language.components.loggingSelect.options.suggestion.label,
                    description: language.components.loggingSelect.options.suggestion.desc,
                    value: 'suggestlogs',
                },
                {
                    label: language.components.loggingSelect.options.birthday.label,
                    description: language.components.loggingSelect.options.birthday.desc,
                    value: 'birthdaylogs',
                },
                {
                    label: language.components.loggingSelect.options.application.label,
                    description: language.components.loggingSelect.options.application.desc,
                    value: 'applicationlogs',
                },
                {
                    label: language.components.loggingSelect.options.economy.label,
                    description: language.components.loggingSelect.options.economy.desc,
                    value: 'economylogs',
                },
                {
                    label: language.components.loggingSelect.options.eco.label,
                    description: language.components.loggingSelect.options.eco.desc,
                    value: 'leveluplogs',
                },
                {
                    label: language.components.loggingSelect.options.other.label,
                    description: language.components.loggingSelect.options.other.desc,
                    value: 'otherlogs',
                }
            ]),
    );
    await interaction.update({ components: [base, client.refreshButton, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};