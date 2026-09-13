module.exports = async function(client, con, interaction, data, language) {
    let selection = interaction.values[0];
    await con.query(`SELECT * FROM shop WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: `${language.components.shopSelect.g}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        await con.query(`SELECT * FROM shop WHERE guildid='${interaction.guild.id}' AND productId=${selection}`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return interaction.reply({ content: `${language.components.shopSelect.a}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            let p = row[0];
            let needed = p.productPrice;
            await con.query(`SELECT * FROM economyusers WHERE guildid='${interaction.guild.id}' AND userid='${interaction.user.id}'`, async (err, row) => {
                if(err) throw err;
                if(!row[0]) await con.query(`INSERT INTO economyusers (guildid, userid, bank, balance, workCooldown, crimeCooldown, robCooldown) VALUES ('${interaction.guild.id}', '${interaction.user.id}', 100, 0, 'false', 'false', 'false')`, async (err, row) => { if(err) throw err; });
                await con.query(`SELECT * FROM economyusers WHERE guildid='${interaction.guild.id}' AND userid='${interaction.user.id}'`, async (err, row) => {
                    if(needed > row[0].balance) return interaction.reply({ content: `${language.components.shopSelect.b}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    await con.query(`UPDATE economyusers SET balance = balance - ${needed} WHERE guildid='${interaction.guild.id}' AND userid='${interaction.user.id}'`, async (err, row) => {
                        if(err) throw err;
                    });
                    await con.query(`INSERT INTO owneditems (guildid, userid, productId, productName) VALUES ("${interaction.guild.id}", "${interaction.user.id}", "${p.productId}", "${p.productName}")`, async (err, row) => {
                        if(err) throw err;
                    });
                    await interaction.reply({ content: `**${interaction.user.tag}** ${language.components.shopSelect.c} ${p.productName}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    let logembed = new client.discord.MessageEmbed()
                    .setColor(data.themecolor || '#FFFFFF')
                    .setAuthor({ name: `${interaction.user.tag} ${language.components.shopSelect.d}`, iconURL: client.user.displayAvatarURL() })
                    .addFields(
                        { name: `${language.components.shopSelect.e}`, value: `${p.productName}`, inline: true },
                        { name: `${language.components.shopSelect.f}`, value: `${p.productPrice}`, inline: true },
                    )
                    .setTimestamp()
                    await client.utils.sendLog(client, con, data, 'economylogs', logembed);
                });
            });
        });
    });
};