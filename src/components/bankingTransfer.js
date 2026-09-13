module.exports = async function(client, con, interaction, data, language) {
    await interaction.reply({ content: language.components.bankingTransfer.user, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
    let c = 0;
    let input;
    let user;
    collector.on('collect', async (m) => {
        c++;
        if(c == 1) {
            if(m.mentions.users.first()) {
                user = m.mentions.users.first().id;
                await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                await interaction.editReply({ content: language.components.bankingTransfer.aUser, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            } else if(!isNaN(m.content)) {
                let lol = await client.users.fetch(m.content);
                if(lol == undefined) {
                    await interaction.editReply({ content: language.components.bankingTransfer.valUser, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    c = 0;
                    return;
                } else {
                    user = lol.id;
                    await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    await interaction.editReply({ content: language.components.bankingTransfer.aUser, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                }
            } else {
                await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                await interaction.editReply({ content: language.components.bankingTransfer.valUser, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                c = 0;
                return;
            }
        } else if(c == 2) {
            if(isNaN(m.content)) {
                await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                return interaction.editReply({ content: language.components.bankingTransfer.valNumber, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            };
            input = Number(m.content);
            await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            if(input <= 0) {
                await interaction.editReply({ content: language.components.bankingTransfer.valNumber1, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                return;
            };
            await con.query(`SELECT * FROM economyusers WHERE guildid='${interaction.guild.id}' AND userid='${interaction.user.id}'`, async (err, row) => {
                if(err) throw err;
                if(input > row[0].balance) {
                    await interaction.editReply({ content: language.components.bankingTransfer.notEnough, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    return;
                } else {
                    await con.query(`UPDATE economyusers SET balance = balance - ${input} WHERE userid='${interaction.user.id}' AND guildid='${interaction.guild.id}'`, async (err, row) => {
                        if(err) throw err;
                    });
                    await con.query(`UPDATE economyusers SET bank = bank + ${input} WHERE userid='${user}' AND guildid='${interaction.guild.id}'`, async (err, row) => {
                        if(err) throw err;
                    });
                    await interaction.editReply({ content: `**${data.currency}${input}${language.components.bankingTransfer.Done}`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    let logembed = new client.discord.MessageEmbed()
                    .setColor(data.themecolor || '#FFFFFF')
                    .setAuthor({ name: `${interaction.user.tag}${language.components.bankingTransfer.logAuthor}`, iconURL: client.user.displayAvatarURL() })
                    .addFields(
                        { name: language.components.bankingDeposit.amount, value: `${data.currency}${input}`, inline: true },
                        { name: language.components.bankingTransfer.reciever, value: `<@${user}>`, inline: true }
                    )
                    .setTimestamp()
                    await client.utils.sendLog(client, con, data, 'economylogs', logembed);
                    collector.stop();
                    return;
                };
            });
        }
    });
};