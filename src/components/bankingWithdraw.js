module.exports = async function(client, con, interaction, data, language) {
    await interaction.reply({ content: language.components.bankingWithdraw.iAmouunt, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
    collector.on('collect', async (m) => {
        if(isNaN(m.content)) {
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            return interaction.editReply({ content: language.components.bankingWithdraw.number, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        };
        let input = Number(m.content);
        await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        if(input <= 0) {
            await interaction.editReply({ content: language.components.bankingWithdraw.valNumber, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            return;
        };
        await con.query(`SELECT * FROM economyusers WHERE guildid='${interaction.guild.id}' AND userid='${interaction.user.id}'`, async (err, row) => {
            if(err) throw err;
            if(input > row[0].bank) {
                await interaction.editReply({ content: language.components.bankingWithdraw.notEnough, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                return;
            } else {
                await con.query(`UPDATE economyusers SET bank = bank - ${input}, balance = balance + ${input} WHERE userid='${interaction.user.id}' AND guildid='${interaction.guild.id}'`, async (err, row) => {
                    if(err) throw err;
                });
                await interaction.editReply({ content: `${language.components.bankingWithdraw.Withdrew}${data.currency}${input}${language.components.bankingWithdraw.Withdrew1}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                let logembed = new client.discord.MessageEmbed()
                .setColor(data.themecolor || '#FFFFFF')
                .setAuthor({ name: `${interaction.user.tag}${language.components.bankingWithdraw.logAuthor}`, iconURL: client.user.displayAvatarURL() })
                .addFields(
                    { name: `${language.components.bankingDeposit.amount}`, value: `${data.currency}${input}`, inline: true },
                )
                .setTimestamp()
                await client.utils.sendLog(client, con, data, 'economylogs', logembed);
                collector.stop();
                return;
            };
        });
    });
};