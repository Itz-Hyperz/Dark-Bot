module.exports = async function(client, con, interaction, data, language) {
    let curr = Number(interaction.message.embeds[0].footer.text) + 1;
    let uniqueid = interaction.message.embeds[0].author.name;
    await con.query(`SELECT * FROM selfrolemenus WHERE guildid='${interaction.guild.id}' AND uniqueid='${uniqueid}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.components.selfRolesManagerNext.no, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        let menuname = row[0].menuname;
        let uniqueid = row[0].uniqueid;
        await con.query(`SELECT * FROM selfroles WHERE guildid='${interaction.guild.id}' AND panelid='${uniqueid}'`, async (err, row) => {
            if(err) throw err;
            if(!row[curr]) curr = 0;
            let embed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setAuthor({ name: uniqueid, iconURL: client.user.avatarURL({ dynamic: true }) })
            .setTitle(`${language.components.selfRolesManagerNext.title}`)
            .setDescription(`${language.components.selfRolesManagerNext.menuNae} \`${menuname || language.components.selfRolesManagerNext.noMenus}\`\n\n${language.components.selfRolesManagerNext.roleName} \`${row[curr]?.rolename || language.components.selfRolesManagerNext.noRoles}\`\n${language.components.selfRolesManagerNext.roleId} \`${row[curr]?.roleid || language.components.selfRolesManagerNext.noRoles}\``)
            .setTimestamp()
            .setFooter({ text: `${curr}` })
            await interaction.update({ embeds: [embed] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        });
    });
};