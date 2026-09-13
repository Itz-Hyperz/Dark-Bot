module.exports = async function(client, con, interaction, data, menu, language) {
    await con.query(`SELECT * FROM marriage WHERE guildid='${interaction.guild.id}' AND confirmed=true AND userid='${interaction.user.id}'`, async (err, row) => {
        if(err) throw err;
        let user;
        let sryjit = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`${language.components.marriageDivorce.title}`)
        .setDescription(`${language.components.marriageDivorce.desc} ${interaction.user.tag}${language.components.marriageDivorce.divorced}`)
        .setTimestamp()
        if(!row[0]) {
            await con.query(`SELECT * FROM marriage WHERE guildid='${interaction.guild.id}' AND confirmed=true AND spouse='${interaction.user.id}'`, async (err, row) => {
                if(err) throw err;
                if(!row[0]) {
                    interaction.reply({ content: language.components.marriageDivorce.not, ephemeral: true });
                    return;
                } else {
                    user = row[0].userid
                    let spouse = client.users.fetch(user);
                    if(typeof spouse != undefined) {
                        spouse?.send({ embeds: [sryjit] }).catch(e => {})
                    };
                    await con.query(`DELETE FROM marriage WHERE guildid='${interaction.guild.id}' AND confirmed=true AND userid='${interaction.user.id}'`, async (err, row) => {
                        if(err) throw err;
                    });
                    await con.query(`DELETE FROM marriage WHERE guildid='${interaction.guild.id}' AND confirmed=true AND spouse='${spouse.id}'`, async (err, row) => {
                        if(err) throw err;
                    });
                    interaction.reply({ content: language.components.marriageDivorce.no, ephemeral: true });
                }
            });
        } else {
            user = row[0].spouse
            let spouse = await client.users.fetch(user);
            spouse.send({ embeds: [sryjit] }).catch(e => {})
            await con.query(`DELETE FROM marriage WHERE guildid='${interaction.guild.id}' AND confirmed=true AND userid='${interaction.user.id}'`, async (err, row) => {
                if(err) throw err;
            });
            await con.query(`DELETE FROM marriage WHERE guildid='${interaction.guild.id}' AND confirmed=true AND spouse='${spouse.id}'`, async (err, row) => {
                if(err) throw err;
            });
            interaction.reply({ content: language.components.marriageDivorce.no, ephemeral: true });
        }
    });
};