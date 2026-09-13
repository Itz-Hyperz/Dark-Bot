module.exports = async function(client, con, interaction, data, language) {
    let selection = interaction.values[0];
    if(selection == undefined) return;

    if(selection == 'pingPreventionAdd') {
        require('./pingPreventionAdd.js')(client, con, interaction, data);
    } else if(selection == 'pingPreventionRemove') {
        require('./pingPreventionRemove.js')(client, con, interaction, data);
    };
};