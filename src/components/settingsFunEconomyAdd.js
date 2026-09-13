module.exports = async function(client, con, interaction, data, language) {
    await interaction.reply({ content: language.components.settingsFunEconomyAdd.p, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    const filter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 150000 });
    let c = 0;
    let input1;
    let input2;
    collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.settingsFunEconomyAdd.c, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.settingsFunEconomyAdd.c, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
        c++;
        if(c == 1) {
            input1 = m.content;
            input1 = input1.replaceAll('"', '');
            input1 = input1.replaceAll("`", "");
            m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            await interaction.editReply({ content: language.components.settingsFunEconomyAdd.price, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        } else if(c == 2) {
            input2 = Number(m.content);
            if(isNaN(input2)) {
                c = 1;
                m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                await interaction.editReply({ content: language.components.settingsFunEconomyAdd.price1, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            } else {
                await con.query(`SELECT COUNT(productId) as total FROM shop WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
                    if(err) throw err;
                    let counted = await client.utils.makeid(9);
                    await con.query(`INSERT INTO shop (guildid, productId, productName, productPrice) VALUES ("${interaction.guild.id}", "${counted}", "${input1}", ${input2})`, async (err, row) => {
                        if(err) throw err;
                        await m.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                        interaction.editReply({ content: `${language.components.settingsFunEconomyAdd.added}\n\`\`\`\n${counted} - ${input1} - ($)${input2}\n\`\`\``, ephemeral: true })
                        collector.stop();
                        let logembed = new client.discord.MessageEmbed()
                        .setColor(data.themecolor || '#FFFFFF')
                        .setAuthor({ name: `${interaction.user.tag}${language.components.settingsFunEconomyAdd.title}`, iconURL: client.user.displayAvatarURL() })
                        .addFields(
                            { name: `${language.components.settingsFunEconomyAdd.item}`, value: `${input1}`, inline: true },
                            { name: `${language.components.settingsFunEconomyAdd.price}`, value: `${input2}`, inline: true },
                        )
                        .setTimestamp()
                        await client.utils.sendLog(client, con, data, 'economylogs', logembed);
                        return;
                    });
                });
            };
        };
    });
};