module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text);
    await con.query(`SELECT * FROM applications WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[curr]) return interaction.reply({ content: "This application could not be found in the database.", ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let buttons = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.controls)
            .setStyle('SECONDARY')
            .setCustomId('appControlsDisabled1')
            .setDisabled(true)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.back)
            .setStyle('PRIMARY')
            .setCustomId('appMenuQuestionsBack')
        )
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.next)
            .setStyle('PRIMARY')
            .setCustomId('appMenuQuestionsNext')
        )
        let buttons2 = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.options)
            .setStyle('SECONDARY')
            .setCustomId('appControlsDisabled2')
            .setDisabled(true)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.appMenuQuestions.add)
            .setStyle('SUCCESS')
            .setCustomId('appMenuQuestionsAdd')
        )
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.deleteSelected)
            .setStyle('DANGER')
            .setCustomId('appMenuQuestionsDelete')
        )
        let gohome = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setLabel(language.globalButtons.home)
            .setStyle('SECONDARY')
            .setCustomId('appMenuGoHome')
        )
        let appName = row[curr].appname;
        let uniqueid = row[curr].uniqueid;
        await con.query(`SELECT * FROM applicationquestions WHERE appid='${uniqueid}'`, async (err, row) => {
            if(err) throw err;
            let embed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setTitle(language.components.appMenuQuestions.title)
            .setAuthor({ name: uniqueid, iconURL: client.user.avatarURL({ dynamic: true }) })
            .setDescription(`**${language.components.appMenuQuestions.app}** ${appName}\n**${language.components.appMenuQuestions.question}**\n\`\`\`\n${row[0]?.question || language.components.appMenuQuestions.noQuestion}\n\`\`\``)
            .setTimestamp()
            .setFooter({ text: '0' })
            await interaction.update({ embeds: [embed], components: [buttons, buttons2, gohome], ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        });
    });
};