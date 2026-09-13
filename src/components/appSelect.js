module.exports = async function(client, con, interaction, data, language) {
    let selection = interaction.values[0];
    let questions = [];
    let answers = [];
    let curr = 0;
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.deny)
        .setStyle('DANGER')
        .setCustomId('appDeny')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.accept)
        .setStyle('SUCCESS')
        .setCustomId('appAccept')
    )
    await con.query(`SELECT * FROM applications WHERE uniqueid='${selection}' AND guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.deferUpdate();
        let app = row[0];
        await con.query(`SELECT * FROM applicationquestions WHERE appid='${app.uniqueid}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) return interaction.reply({ content: language.components.appSelect.noQuestions, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            await row.forEach(async (q) => {
                questions.push(q.question);
            });
            let mainEmbed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setTitle(`${app.appname}`)
            .setDescription(language.components.appSelect.pleaseAnswer)
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setTimestamp()
            await interaction.user.send({ embeds: [mainEmbed] }).then((msg) => {
                interaction.reply({ content: `**${language.components.appSelect.started}**`, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                let quesEmbed = new client.discord.MessageEmbed()
                .setColor(data.themecolor || '#FFFFFF')
                .setDescription(`**${questions[curr]}**`)
                interaction.user.send({ embeds: [quesEmbed] }).catch(e => {})
                const filter = (m) => m.author.id == interaction.user.id;
                const collector = msg.channel.createMessageCollector({ filter, time: 1000000000 });
                collector.on('collect', async (m) => {
            if(m.content.toLowerCase() == language.cancel) {
                await m?.delete().catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                collector.stop();
                return interaction.reply({ content: language.components.appSelect.cancel, ephemeral: true }).catch(e => {
                    interaction.editReply({ content: language.components.appSelect.cancel, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                });
            };
                    answers.push(`\`${language.components.appSelect.q}:\` **${questions[curr]}**\n\`${language.components.appSelect.a}:\` ${m.content}`);
                    curr++;
                    if(!questions[curr]) {
                        collector.stop();
                        return;
                    }
                    let quesEmbed = new client.discord.MessageEmbed()
                    .setColor(data.themecolor || '#FFFFFF')
                    .setDescription(`**${questions[curr]}**`)
                    await interaction.user.send({ embeds: [quesEmbed] }).catch(e => {})
                });
                collector.on('end', async (collected) => {
                    let embed = new client.discord.MessageEmbed()
                    .setColor(data.themecolor || '#FFFFFF')
                    .setAuthor({ name: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setTitle(`${app.appname}`)
                    .setDescription(`${answers.join('\n\n')}\n\n**${language.components.appSelect.date}**\n${(new Date).toDateString()}`)
                    .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setFooter({ text: app.uniqueid })
                    await client.utils.sendLog(client, con, data, 'applicationlogs', embed, { components: [buttons] })
                    await interaction.user.send({ content: `**${language.components.appSelect.submitted}**` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    return;
                });
            }).catch(e => {
                interaction.reply({ content: language.components.appSelect.failed, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            });
        })
    });
};