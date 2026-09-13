const { Modal, TextInputComponent, showModal } = require('discord-modals') // Now we extract the showModal method
module.exports = async function(client, con, interaction, data, language) {
    const modal = new Modal() // We create a Modal
    .setCustomId('appMenuCreate')
    .setTitle(language.components.appMenuAdd.title)
    .addComponents(
        [
            new TextInputComponent() // We create a Text Input Component
            .setCustomId('appInputName')
            .setLabel(language.components.appMenuAdd.name)
            .setStyle('SHORT') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
            .setMinLength(1)
            .setMaxLength(100)
            .setPlaceholder(language.components.appMenuAdd.here)
            .setRequired(true) // If it's required or not
        ]
    )
    .addComponents(
        [
            new TextInputComponent() // We create a Text Input Component
            .setCustomId('appInputAccept')
            .setLabel(language.components.appMenuAdd.am)
            .setStyle('LONG') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
            .setMinLength(1)
            .setMaxLength(4000)
            .setPlaceholder(language.components.appMenuAdd.aam)
            .setRequired(true) // If it's required or not
        ]
    )
    .addComponents(
        [
            new TextInputComponent() // We create a Text Input Component
            .setCustomId('appInputDeny')
            .setLabel(language.components.appMenuAdd.dm)
            .setStyle('LONG') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
            .setMinLength(1)
            .setMaxLength(4000)
            .setPlaceholder(language.components.appMenuAdd.ddm)
            .setRequired(true) // If it's required or not
        ]
    )
    showModal(modal, {
        client: client,
        interaction: interaction
    });
};