/*
    admin
    mod
    filter
    info
    sticky
    giveaway
    clients
    tickets
    applications
    customers
    pingprev
    selfroles
*/
module.exports = async function(client, con, interaction, data, language) {
    let gohome = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(`${language.globalButtons.home}`)
        .setStyle('SECONDARY')
        .setCustomId('permsHome')
    )
    let base = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageSelectMenu()
            .setCustomId('permsSelect')
            .setPlaceholder(`${language.components.permsAdd.place}`)
            .addOptions([
                {
                    label: language.components.permsAdd.options.admin.label,
                    description: `${language.components.permsAdd.options.admin.desc}`,
                    value: 'admin',
                },
                {
                    label: `${language.components.permsAdd.options.mod.label}`,
                    description: `${language.components.permsAdd.options.mod.label}`,
                    value: 'mod',
                },
                {
                    label: `${language.components.permsAdd.options.filter.label}`,
                    description: `${language.components.permsAdd.options.filter.desc}`,
                    value: 'filter',
                },
                {
                    label: `${language.components.permsAdd.options.info.label}`,
                    description: `${language.components.permsAdd.options.info.desc}`,
                    value: 'info',
                },
                {
                    label: `${language.components.permsAdd.options.roles.label}`,
                    description: `${language.components.permsAdd.options.roles.desc}`,
                    value: 'selfroles',
                },
                {
                    label: `${language.components.permsAdd.options.sticky.label}`,
                    description: `${language.components.permsAdd.options.sticky.desc}`,
                    value: 'sticky',
                },
                {
                    label: `${language.components.permsAdd.options.giveaway.label}`,
                    description: `${language.components.permsAdd.options.giveaway.desc}`,
                    value: 'giveaway',
                },
                {
                    label: `${language.components.permsAdd.options.client.label}`,
                    description: `${language.components.permsAdd.options.client.desc}`,
                    value: 'clients',
                },
                {
                    label: `${language.components.permsAdd.options.ticket.label}`,
                    description: `${language.components.permsAdd.options.ticket.desc}`,
                    value: 'tickets',
                },
                {
                    label: `${language.components.permsAdd.options.apps.label}`,
                    description: `${language.components.permsAdd.options.apps.desc}`,
                    value: 'applications',
                },
                {
                    label: `${language.components.permsAdd.options.customers.label}`,
                    description: `${language.components.permsAdd.options.customers.desc}`,
                    value: 'customers',
                },
                {
                    label: `${language.components.permsAdd.options.pingPrev.label}`,
                    description: `${language.components.permsAdd.options.pingPrev.desc}`,
                    value: 'pingprev',
                }
            ]),
    );
    await interaction.update({ components: [base, client.refreshButton, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};