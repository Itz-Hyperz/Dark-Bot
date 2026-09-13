module.exports = async function(client, con, interaction, data, language) {
    let controls = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('selfRolesDisabled2')
            .setStyle('SECONDARY')
            .setLabel(`${language.globalButtons.controls}`)
            .setDisabled(true)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('selfRolesBack')
            .setStyle('PRIMARY')
            .setLabel(`${language.globalButtons.back}`)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('selfRolesNext')
            .setStyle('PRIMARY')
            .setLabel(`${language.globalButtons.next}`)
        )
        let buttons = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('selfRolesDisabled')
            .setStyle('SECONDARY')
            .setLabel(`${language.globalButtons.options}`)
            .setDisabled(true)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('selfRolesAdd')
            .setStyle('SUCCESS')
            .setLabel(`${language.components.selfRolesGoHome.addMenu}`)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('selfRolesDelete')
            .setStyle('DANGER')
            .setLabel(`${language.components.selfRolesGoHome.delete}`)
        )
        let buttons2 = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('selfRolesDisabled3')
            .setStyle('SECONDARY')
            .setLabel(`${language.globalButtons.settings}`)
            .setDisabled(true)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('selfRolesManager')
            .setStyle('SECONDARY')
            .setLabel(`${language.components.selfRolesGoHome.roleManager}`)
        )
        .addComponents(
            new client.discord.MessageButton()
            .setCustomId('selfRolesPost')
            .setStyle('PRIMARY')
            .setLabel(`${language.components.selfRolesGoHome.postPanel}`)
        )
        await con.query(`SELECT * FROM selfrolemenus WHERE guildid='${interaction.guild.id}'`, async (err, row) => {
            if(err) throw err;
            let embed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setTitle(`${language.components.selfRolesGoHome.title}`)
            .setDescription(`${language.components.selfRolesGoHome.desc} \`${row[0]?.menuname || language.components.selfRolesGoHome.noMenus}\``)
            .setTimestamp()
            .setFooter({ text: '0' })
            await interaction.update({ embeds: [embed], components: [controls, buttons, buttons2], ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        });
};