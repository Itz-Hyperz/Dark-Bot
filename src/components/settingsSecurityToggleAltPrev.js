module.exports = async function(client, con, interaction, data, language) {
    let gohome = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(`${language.components.settingsSecurityToggleAltPrev.a}`)
        .setStyle('SECONDARY')
        .setCustomId('settingsGoHome')
    )
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(`${language.components.settingsSecurityToggleAltPrev.b}`)
        .setStyle('SECONDARY')
        .setCustomId('settingsSecurityToggleDisabled')
        .setDisabled(true)
    )
    if(data.altprev) {
        await con.query(`UPDATE guilds SET altprev=false WHERE guildid='${data.guildid}'`, async (err, row) => {
            if(err) throw err;
        });
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(`${language.components.settingsSecurityToggleAltPrev.c}`)
            .setStyle('DANGER')
            .setCustomId('settingsSecurityToggleAltPrev')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(`${language.components.settingsSecurityToggleAltPrev.d}`)
            .setStyle('SECONDARY')
            .setCustomId('settingsSecurityAltPrevTime')
        )
        await interaction.update({ components: [buttons, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    } else {
        await con.query(`UPDATE guilds SET altprev=true WHERE guildid='${data.guildid}'`, async (err, row) => {
            if(err) throw err;
        });
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(`${language.components.settingsSecurityToggleAltPrev.c}`)
            .setStyle('SUCCESS')
            .setCustomId('settingsSecurityToggleAltPrev')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(`${language.components.settingsSecurityToggleAltPrev.d}`)
            .setStyle('SECONDARY')
            .setCustomId('settingsSecurityAltPrevTime')
        )
        await interaction.update({ components: [buttons, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    };
};