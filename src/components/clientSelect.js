module.exports = async function(client, con, interaction, data, language) {
    let selection = interaction.values[0];
    if(selection == undefined) return;

    if(selection == 'clientAdd') {
        require('./clientAdd.js')(client, con, interaction, data, language);
    } else if(selection == 'clientRemove') {
        require('./clientRemove.js')(client, con, interaction, data, language);
    };
};