module.exports = async function(client, con, interaction, data, language) {
    let gohome = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(`${language.components.settingsSecurityToggleLockdown.a}`)
        .setStyle('SECONDARY')
        .setCustomId('settingsGoHome')
    )
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(`${language.components.settingsSecurityToggleLockdown.b}`)
        .setStyle('SECONDARY')
        .setCustomId('settingsSecurityToggleDisabled')
        .setDisabled(true)
    )
    if(data.lockdown) {
        await con.query(`UPDATE guilds SET lockdown=false WHERE guildid='${data.guildid}'`, async (err, row) => {
            if(err) throw err;
        });
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(`${language.components.settingsSecurityToggleLockdown.c}`)
            .setStyle('DANGER')
            .setCustomId('settingsSecurityToggleLockdown')
        )
        await interaction.update({ components: [buttons, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let logembed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`${language.components.settingsSecurityToggleLockdown.d}`)
        .setThumbnail(`${interaction.user.avatarURL({dynamic: true})}`)
        .addFields(
            {name: `${language.components.settingsSecurityToggleLockdown.e}`, value: `${interaction.user.tag}`},
            {name: `${language.components.settingsSecurityToggleLockdown.f}`, value: `false`},
        )
        .setTimestamp()
        await client.utils.sendLog(client, con, data, 'serverlocklogs', logembed);
    } else {
        await con.query(`UPDATE guilds SET lockdown=true WHERE guildid='${data.guildid}'`, async (err, row) => {
            if(err) throw err;
        });
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(`${language.components.settingsSecurityToggleLockdown.g}`)
            .setStyle('SUCCESS')
            .setCustomId('settingsSecurityToggleLockdown')
        )
        await interaction.update({ components: [buttons, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let logembed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setTitle(`${language.components.settingsSecurityToggleLockdown.d}`)
        .setThumbnail(`${interaction.user.avatarURL({dynamic: true})}`)
        .addFields(
            {name: `${language.components.settingsSecurityToggleLockdown.e}`, value: `${interaction.user.tag}`},
            {name: `${language.components.settingsSecurityToggleLockdown.f}`, value: `true`},
        )
        .setTimestamp()
        await client.utils.sendLog(client, con, data, 'serverlocklogs', logembed);
    };
};