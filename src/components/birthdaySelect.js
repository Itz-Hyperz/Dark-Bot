module.exports = async function(client, con, interaction, data, language) {
    let selection = interaction.values[0];
    if(selection == undefined) return;

    if(selection == 'birthdayAdd') {
        require('./birthdayAdd.js')(client, con, interaction, data, language);
    } else if(selection == 'birthdayRemove') {
        require('./birthdayRemove.js')(client, con, interaction, data, language);
    };
};