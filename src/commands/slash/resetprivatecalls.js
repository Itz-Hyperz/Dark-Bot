exports.run = async function(client, con, interaction, data, language) {
  con.query(`SELECT * FROM privatecalls WHERE ownerid="${interaction.user.id}" AND guildid="${interaction.guild.id}"`, async (err, row) => {
    if(err) throw err;
    if(!row[0]) return interaction.reply({ content: `${language.privatevcreset}`, ephemeral: true }).catch(e => {});
    await con.query(`DELETE FROM privatecalls WHERE ownerid="${interaction.user.id}" AND guildid="${interaction.guild.id}"`, async (err, row) => {
      if(err) throw err;
      interaction.reply({ content: `${language.privatevcreset}`, ephemeral: true }).catch(e => {});
    });
    await row.forEach(async function(item) {
      let channelfetch = await client.channels.cache.get(item.uniqueid);
      await channelfetch.delete();
    });
  });
}

exports.info = {
    "name": "resetprivatecalls",
    "description": "Reset your private calls in this guild."
}