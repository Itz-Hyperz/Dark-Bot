exports.run = async function(client, con, interaction, data, language) {
    let role = await interaction.options.getRole('role');
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(e => {});
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(e => {});
        let c = true;
        await interaction.guild.members.cache.forEach(async (m) => {
            if(m.user.id != client.user.id) {
                await m.roles.add(role.id).catch(e => {
                    c = false;
                });
            };
        });
        setTimeout(async () => {
            if(c) {
                await interaction.reply({ content: language.massrole.begin, ephemeral: true }).catch(e => {});
            } else {
                await interaction.reply({ content: `${language.massrole.failed}\n${language.massrole.missing}`, ephemeral: true }).catch(e => {});
            };
        }, 500);
    });
};

exports.info = {
    "name": "massrole",
    "description": "Give every member in this server a role.",
    "options": [
      {
        "name": "role",
        "description": "The role to give to every member.",
        "required": true,
        "type": "ROLE"
      }
    ]
}