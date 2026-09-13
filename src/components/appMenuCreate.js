// Boots via Modal
module.exports = async function(client, con, modal, data, language) {
    try {
        let uniqueid = await client.utils.random(16);
        let name = modal.getTextInputValue('appInputName');
        name = name.replaceAll('"', '');
        name = name.replaceAll('`', '');
        let accept = modal.getTextInputValue('appInputAccept');;
        accept = accept.replaceAll('"', '');
        accept = accept.replaceAll('`', '');
        let deny = modal.getTextInputValue('appInputDeny');;
        deny = deny.replaceAll('"', '');
        deny = deny.replaceAll('`', '');
        await con.query(`INSERT INTO applications (guildid, uniqueid, closed, appname, acceptMessage, denyMessage) VALUES ("${modal.guildId}", "${uniqueid}", false, "${name}", "${accept}", "${deny}")`, async (err, row) => {
            if(err) throw err;
        });
        await modal.deferReply({ ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        await modal.followUp({ content: `**${language.components.appMenuCreate.created}**`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    } catch(e) {};
};