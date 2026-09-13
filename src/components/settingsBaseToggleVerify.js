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
    if(data.verification) {
        await con.query(`UPDATE guilds SET verification=false WHERE guildid='${data.guildid}'`, async (err, row) => {
            if(err) throw err;
        });
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseToggleVerify.buttons.verify)
            .setStyle('DANGER')
            .setCustomId('settingsBaseToggleVerify')
        )
        if(data.captcha) {
            buttons.addComponents(
                new client.discord.MessageButton()
                .setLabel(language.components.settingsBaseToggleVerify.buttons.captcha)
                .setStyle('SUCCESS')
                .setCustomId('settingsBaseToggleCaptcha')
            )
        } else {
            buttons.addComponents(
                new client.discord.MessageButton()
                .setLabel(language.components.settingsBaseToggleVerify.buttons.captcha)
                .setStyle('DANGER')
                .setCustomId('settingsBaseToggleCaptcha')
            )
        };
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseToggleVerify.buttons.post)
            .setStyle('PRIMARY')
            .setCustomId('settingsBasePanelVerifyPost')
        )
        await interaction.update({ components: [buttons, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    } else {
        await con.query(`UPDATE guilds SET verification=true WHERE guildid='${data.guildid}'`, async (err, row) => {
            if(err) throw err;
        });
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseToggleVerify.buttons.verify)
            .setStyle('SUCCESS')
            .setCustomId('settingsBaseToggleVerify')
        )
        if(data.captcha) {
            buttons.addComponents(
                new client.discord.MessageButton()
                .setLabel(language.components.settingsBaseToggleVerify.buttons.captcha)
                .setStyle('SUCCESS')
                .setCustomId('settingsBaseToggleCaptcha')
            )
        } else {
            buttons.addComponents(
                new client.discord.MessageButton()
                .setLabel(language.components.settingsBaseToggleVerify.buttons.captcha)
                .setStyle('DANGER')
                .setCustomId('settingsBaseToggleCaptcha')
            )
        };
        buttons.addComponents(
            new client.discord.MessageButton()
            .setLabel(language.components.settingsBaseToggleVerify.buttons.post)
            .setStyle('PRIMARY')
            .setCustomId('settingsBasePanelVerifyPost')
        )
        await interaction.update({ components: [buttons, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    };
};