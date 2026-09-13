module.exports = async function(client, con, interaction, data, language) {
    let selection = interaction.values[0];
    if(selection == undefined) return;

    if(selection == 'stickyAdd') {
        require('./stickyAdd.js')(client, con, interaction, data, language);
    } else if(selection == 'stickyRemove') {
        require('./stickyRemove.js')(client, con, interaction, data, language);
    };
};