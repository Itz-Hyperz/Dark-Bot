// Have fun trying to rip this code 😈
module.exports = async function(client, con, interaction, data, language) {
    let selection = interaction.values[0];
    let gohome = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setLabel(`${language.components.settingsSelect.a}`)
        .setStyle('SECONDARY')
        .setCustomId('settingsGoHome')
    )
    let base = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageSelectMenu()
            .setCustomId('settingsBaseSelect')
            .setPlaceholder(`${language.components.settingsSelect.ad}`)
            .addOptions([
                {
                    label: `${language.components.settingsSelect.b}`,
                    description: `${language.components.settingsSelect.o}`,
                    value: 'settingsBaseGeneralSettings',
                },
                {
                    label: `${language.components.settingsSelect.c}`,
                    description: `${language.components.settingsSelect.p}`,
                    value: 'settingsBaseWelcome',
                },
                {
                    label: `${language.components.settingsSelect.d}`,
                    description: `${language.components.settingsSelect.q}`,
                    value: 'settingsBaseLeave',
                },
                {
                    label: `${language.components.settingsSelect.e}`,
                    description: `${language.components.settingsSelect.r}`,
                    value: 'settingsBaseVerification',
                },
                {
                    label: `${language.components.settingsSelect.f}`,
                    description: `${language.components.settingsSelect.s}`,
                    value: 'settingsBaseAutorole',
                }
            ]),
    );
    let security = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageSelectMenu()
            .setCustomId('settingsSecuritySelect')
            .setPlaceholder(`${language.components.settingsSelect.ac}`)
            .addOptions([
                {
                    label: `${language.components.settingsSelect.g}`,
                    description: `${language.components.settingsSelect.t}`,
                    value: 'settingsSecurityAltPrevention',
                },
                {
                    label: `${language.components.settingsSelect.h}`,
                    description: `${language.components.settingsSelect.u}`,
                    value: 'settingsSecurityServerLockdown',
                },
                {
                    label: `${language.components.settingsSelect.i}`,
                    description: `${language.components.settingsSelect.v}`,
                    value: 'settingsSecurityFilter',
                }
            ]),
    );
    let fun = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageSelectMenu()
            .setCustomId('settingsFunSelect')
            .setPlaceholder(`${language.components.settingsSelect.ab}`)
            .addOptions([
                {
                    label: `${language.components.settingsSelect.j}`,
                    description: `${language.components.settingsSelect.w}`,
                    value: 'settingsFunLevelSystem',
                },
                {
                    label: `${language.components.settingsSelect.k}`,
                    description: `${language.components.settingsSelect.x}`,
                    value: 'settingsFunBirthdays',
                },
                {
                    label: `${language.components.settingsSelect.l}`,
                    description: `${language.components.settingsSelect.y}`,
                    value: 'settingsFunEconomy',
                },
                {
                    label: `${language.components.settingsSelect.m}`,
                    description: `${language.components.settingsSelect.z}`,
                    value: 'settingsFunAutoReact',
                },
                {
                    label: `${language.components.settingsSelect.n}`,
                    description: `${language.components.settingsSelect.aa}`,
                    value: 'settingsFunAutoRespond',
                }
            ]),
    );
    
    if(selection == 'settingsBase') {
        await interaction.update({ components: [base, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    } else if(selection == 'settingsSecurity') {
        await interaction.update({ components: [security, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    } else if(selection == 'settingsFun') {
        await interaction.update({ components: [fun, gohome] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    };
};