module.exports = async function(client, con, interaction, data, language) {
    let gohome = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.home)
        .setStyle('SECONDARY')
        .setCustomId('settingsGoHome')
    )
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(language.globalButtons.options)
        .setStyle('SECONDARY')
        .setCustomId('settingsBaseToggleDisabled')
        .setDisabled(true)
    )
    if(data.captcha) {
        await con.query(`UPDATE guilds SET captcha=false WHERE guildid='${data.guildid}'`, async (err, row) => {
            if(err) throw err;
        });
        if(data.verification) {
            buttons.addComponents(
                new client.discord.MessageButton()
                .setLabel(language.components.settingsBaseToggleCaptcha.verification)
                .setStyle('SUCCESS')
                .setCustomId('settingsBaseToggleVerify')
            )
        } else {
            buttons.addComponents(
                new client.discord.MessageButton()
                .setLabel(language.components.settingsBaseToggleCaptcha.verification)
                .setStyle('DANGER')
                .setCustomId('settingsBaseToggleVerify')
            )
        };
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseToggleCaptcha.captcha)
            .setStyle('DANGER')
            .setCustomId('settingsBaseToggleCaptcha')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseToggleCaptcha.post)
            .setStyle('PRIMARY')
            .setCustomId('settingsBasePanelVerifyPost')
        )
        await interaction.update({ components: [buttons, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    } else {
        await con.query(`UPDATE guilds SET captcha=true WHERE guildid='${data.guildid}'`, async (err, row) => {
            if(err) throw err;
        });
        if(data.verification) {
            buttons.addComponents(
                new client.discord.MessageButton()
                .setLabel(language.components.settingsBaseToggleCaptcha.verification)
                .setStyle('SUCCESS')
                .setCustomId('settingsBaseToggleVerify')
            )
        } else {
            buttons.addComponents(
                new client.discord.MessageButton()
                .setLabel(language.components.settingsBaseToggleCaptcha.verification)
                .setStyle('DANGER')
                .setCustomId('settingsBaseToggleVerify')
            )
        };
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseToggleCaptcha.captcha)
            .setStyle('SUCCESS')
            .setCustomId('settingsBaseToggleCaptcha')
        )
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseToggleCaptcha.post)
            .setStyle('PRIMARY')
            .setCustomId('settingsBasePanelVerifyPost')
        )
        await interaction.update({ components: [buttons, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    };
};